"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions/auth";
import type { DrawType, Subscription, Score, Draw } from "@/types/database";
import { toEntryNumbers, simulateDraw, resolveDraw, type Entrant } from "@/lib/draw-engine";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Admin access required");

  return { supabase, user };
}

async function getActiveEntrants(supabase: Awaited<ReturnType<typeof createClient>>): Promise<Entrant[]> {
  const { data: activeSubs } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("status", "active")
    .returns<Pick<Subscription, "user_id">[]>();

  const activeUserIds = (activeSubs ?? []).map((s) => s.user_id);
  if (activeUserIds.length === 0) return [];

  const { data: scores } = await supabase
    .from("scores")
    .select("user_id, score")
    .in("user_id", activeUserIds)
    .returns<Pick<Score, "user_id" | "score">[]>();

  const byUser = new Map<string, number[]>();
  (scores ?? []).forEach((s) => {
    const list = byUser.get(s.user_id) ?? [];
    list.push(s.score);
    byUser.set(s.user_id, list);
  });

  return activeUserIds
    .filter((id) => (byUser.get(id) ?? []).length > 0)
    .map((id) => ({ userId: id, numbers: toEntryNumbers(byUser.get(id) ?? []) }));
}

async function getRolloverIn(supabase: Awaited<ReturnType<typeof createClient>>): Promise<number> {
  const { data } = await supabase
    .from("draws")
    .select("jackpot_rollover_out")
    .eq("status", "published")
    .order("month", { ascending: false })
    .limit(1)
    .returns<Pick<Draw, "jackpot_rollover_out">[]>();
  return data?.[0]?.jackpot_rollover_out ?? 0;
}

export async function createDraw(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const month = formData.get("month");
  const drawType = formData.get("drawType");

  if (typeof month !== "string" || !month) return { error: "Pick a month." };
  if (drawType !== "random" && drawType !== "algorithmic") return { error: "Pick a draw type." };

  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.from("draws").insert({
    month: `${month}-01`,
    draw_type: drawType as DrawType,
    status: "draft",
    created_by: user.id,
  });

  if (error) {
    if (error.code === "23505") return { error: "A draw for that month already exists." };
    return { error: error.message };
  }

  revalidatePath("/admin/draws");
  return { success: "Draw created." };
}

export async function simulateDrawAction(formData: FormData): Promise<void> {
  const drawId = formData.get("drawId");
  if (typeof drawId !== "string" || !drawId) return;

  const { supabase } = await requireAdmin();

  const { data: draw } = await supabase.from("draws").select("*").eq("id", drawId).single<Draw>();
  if (!draw) return;

  const entrants = await getActiveEntrants(supabase);
  const rolloverIn = await getRolloverIn(supabase);
  const result = simulateDraw(entrants, draw.draw_type, rolloverIn);

  await supabase
    .from("draws")
    .update({
      winning_numbers: result.winningNumbers,
      entrant_count: result.entrantCount,
      pool_total: result.poolTotal,
      pool_5: result.pool5,
      pool_4: result.pool4,
      pool_3: result.pool3,
      jackpot_rollover_in: result.jackpotRolloverIn,
      jackpot_rollover_out: result.jackpotRolloverOut,
      status: "simulated",
      simulated_at: new Date().toISOString(),
    })
    .eq("id", drawId);

  revalidatePath("/admin/draws");
}

export async function publishDrawAction(formData: FormData): Promise<void> {
  const drawId = formData.get("drawId");
  if (typeof drawId !== "string" || !drawId) return;

  const { supabase } = await requireAdmin();

  const { data: draw } = await supabase.from("draws").select("*").eq("id", drawId).single<Draw>();
  if (!draw || !draw.winning_numbers || draw.winning_numbers.length === 0) return;

  const entrants = await getActiveEntrants(supabase);
  const result = resolveDraw(entrants, draw.winning_numbers, draw.jackpot_rollover_in);

  if (entrants.length > 0) {
    await supabase.from("draw_entries").insert(
      entrants.map((e) => ({ draw_id: drawId, user_id: e.userId, numbers: e.numbers }))
    );

    await supabase.from("draw_results").insert(
      result.results.map((r) => ({
        draw_id: drawId,
        user_id: r.userId,
        match_tier: r.tier,
        prize_amount: r.prizeAmount,
      }))
    );

    const { data: insertedResults } = await supabase
      .from("draw_results")
      .select("id, user_id, match_tier")
      .eq("draw_id", drawId)
      .not("match_tier", "is", null);

    if (insertedResults && insertedResults.length > 0) {
      await supabase.from("winners").insert(
        insertedResults.map((r) => ({
          draw_result_id: r.id,
          user_id: r.user_id,
          status: "unverified",
        }))
      );
    }
  }

  await supabase
    .from("draws")
    .update({
      entrant_count: result.entrantCount,
      pool_total: result.poolTotal,
      pool_5: result.pool5,
      pool_4: result.pool4,
      pool_3: result.pool3,
      jackpot_rollover_out: result.jackpotRolloverOut,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", drawId);

  revalidatePath("/admin/draws");
  revalidatePath("/dashboard", "layout");
}
