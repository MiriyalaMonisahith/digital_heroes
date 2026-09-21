import { createClient } from "@/lib/supabase/server";
import type { Draw, DrawResult } from "@/types/database";

export async function getUpcomingDraw(): Promise<Draw | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("draws")
      .select("*")
      .in("status", ["draft", "simulated"])
      .order("month", { ascending: true })
      .limit(1)
      .returns<Draw[]>();
    return data?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPublishedDraws(): Promise<Draw[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("month", { ascending: false })
      .returns<Draw[]>();
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getMyResultsByDraw(userId: string): Promise<Record<string, DrawResult>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("draw_results")
      .select("*")
      .eq("user_id", userId)
      .returns<DrawResult[]>();
    const map: Record<string, DrawResult> = {};
    (data ?? []).forEach((r) => (map[r.draw_id] = r));
    return map;
  } catch {
    return {};
  }
}

export async function getMyEntryNumbers(userId: string): Promise<number[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("scores")
      .select("score")
      .eq("user_id", userId)
      .order("played_on", { ascending: false })
      .limit(5)
      .returns<{ score: number }[]>();
    return Array.from(new Set((data ?? []).map((s) => s.score))).sort((a, b) => a - b);
  } catch {
    return [];
  }
}
