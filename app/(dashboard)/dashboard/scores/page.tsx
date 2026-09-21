import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Score } from "@/types/database";
import { ScoresManager } from "@/components/dashboard/ScoresManager";

async function getMyScores(userId: string): Promise<Score[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("played_on", { ascending: false })
      .returns<Score[]>();
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ScoresPage() {
  const session = await getCurrentUser();
  const scores = await getMyScores(session!.authUser.id);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Scores</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">Your rounds</h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal-500">
        Your five most recent scores double as your numbers in the monthly draw — no
        separate number picking required.
      </p>

      <div className="mt-8">
        <ScoresManager scores={scores} />
      </div>
    </div>
  );
}
