import { createClient } from "@/lib/supabase/server";
import type { Winner } from "@/types/database";

export interface WinnerWithDraw extends Winner {
  match_tier: string | null;
  prize_amount: number;
  draw_month: string | null;
}

export async function getMyWinners(userId: string): Promise<WinnerWithDraw[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("winners")
      .select("*, draw_results(match_tier, prize_amount, draws(month))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .returns<
        (Winner & {
          draw_results: {
            match_tier: string | null;
            prize_amount: number;
            draws: { month: string } | null;
          } | null;
        })[]
      >();

    return (data ?? []).map((w) => ({
      ...w,
      match_tier: w.draw_results?.match_tier ?? null,
      prize_amount: w.draw_results?.prize_amount ?? 0,
      draw_month: w.draw_results?.draws?.month ?? null,
    }));
  } catch {
    return [];
  }
}
