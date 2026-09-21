import { createClient } from "@/lib/supabase/server";
import type { Charity, Draw, Score, Subscription, Winner } from "@/types/database";

export interface SubscriberOverview {
  subscription: Subscription | null;
  charity: Charity | null;
  scores: Score[];
  drawsEntered: number;
  upcomingDraw: Draw | null;
  winners: (Winner & { prize_amount: number; draw_month: string | null })[];
  totalWon: number;
}

export async function getSubscriberOverview(userId: string): Promise<SubscriberOverview> {
  try {
    const supabase = await createClient();

    const [{ data: subscription }, { data: scores }, { data: entries }, { data: upcomingDraws }] =
      await Promise.all([
        supabase.from("subscriptions").select("*").eq("user_id", userId).single<Subscription>(),
        supabase
          .from("scores")
          .select("*")
          .eq("user_id", userId)
          .order("played_on", { ascending: false })
          .returns<Score[]>(),
        supabase.from("draw_entries").select("draw_id").eq("user_id", userId).returns<{ draw_id: string }[]>(),
        supabase
          .from("draws")
          .select("*")
          .eq("status", "draft")
          .order("month", { ascending: true })
          .limit(1)
          .returns<Draw[]>(),
      ]);

    let charity: Charity | null = null;
    if (subscription?.charity_id) {
      const { data } = await supabase
        .from("charities")
        .select("*")
        .eq("id", subscription.charity_id)
        .single<Charity>();
      charity = data ?? null;
    }

    const { data: winnerRows } = await supabase
      .from("winners")
      .select("*, draw_results(prize_amount, draws(month))")
      .eq("user_id", userId)
      .returns<
        (Winner & { draw_results: { prize_amount: number; draws: { month: string } | null } | null })[]
      >();

    const winners = (winnerRows ?? []).map((w) => ({
      ...w,
      prize_amount: w.draw_results?.prize_amount ?? 0,
      draw_month: w.draw_results?.draws?.month ?? null,
    }));

    const totalWon = winners
      .filter((w) => w.status === "approved" || w.status === "paid")
      .reduce((sum, w) => sum + w.prize_amount, 0);

    return {
      subscription: subscription ?? null,
      charity,
      scores: scores ?? [],
      drawsEntered: entries?.length ?? 0,
      upcomingDraw: upcomingDraws?.[0] ?? null,
      winners,
      totalWon,
    };
  } catch {
    return {
      subscription: null,
      charity: null,
      scores: [],
      drawsEntered: 0,
      upcomingDraw: null,
      winners: [],
      totalWon: 0,
    };
  }
}
