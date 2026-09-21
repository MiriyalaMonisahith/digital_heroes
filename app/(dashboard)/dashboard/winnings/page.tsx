import { getCurrentUser } from "@/lib/auth";
import { getMyWinners } from "@/lib/data/winnings";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Misc";
import { WinnerProofForm } from "@/components/dashboard/WinnerProofForm";

const statusTone: Record<string, "sage" | "amber" | "danger" | "neutral"> = {
  unverified: "amber",
  pending: "neutral",
  approved: "sage",
  rejected: "danger",
  paid: "sage",
};

const statusCopy: Record<string, string> = {
  unverified: "Upload proof to claim your prize",
  pending: "Under review by our team",
  approved: "Approved — payout in progress",
  rejected: "Submission rejected — contact support",
  paid: "Paid out",
};

export default async function WinningsPage() {
  const session = await getCurrentUser();
  const winners = await getMyWinners(session!.authUser.id);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Winnings</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">Your prizes</h1>

      {winners.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No wins yet"
            description="Keep logging your scores — every entrant has a shot each month."
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {winners.map((w) => (
            <Card key={w.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-charcoal-900">
                    {w.draw_month
                      ? new Date(w.draw_month).toLocaleDateString(undefined, {
                          month: "long",
                          year: "numeric",
                        })
                      : "Draw"}{" "}
                    · {w.match_tier}-number match
                  </p>
                  <p className="mt-1 font-display text-2xl text-charcoal-900">
                    ₹{w.prize_amount.toLocaleString()}
                  </p>
                </div>
                <Badge tone={statusTone[w.status]}>{w.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-charcoal-500">{statusCopy[w.status]}</p>

              {w.status === "unverified" && <WinnerProofForm winnerId={w.id} />}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
