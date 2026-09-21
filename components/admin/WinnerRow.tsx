import type { WinnerStatus } from "@/types/database";
import { updateWinnerStatus, getSignedProofUrl } from "@/lib/actions/winners";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SubmitButton } from "@/components/ui/SubmitButton";

const statusTone: Record<WinnerStatus, "sage" | "amber" | "danger" | "neutral"> = {
  unverified: "neutral",
  pending: "amber",
  approved: "sage",
  rejected: "danger",
  paid: "sage",
};

export async function WinnerRow({
  winner,
}: {
  winner: {
    id: string;
    user_name: string;
    match_tier: string | null;
    prize_amount: number;
    draw_month: string | null;
    status: WinnerStatus;
    proof_url: string | null;
  };
}) {
  const proofUrl = winner.proof_url ? await getSignedProofUrl(winner.proof_url) : null;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-charcoal-900">{winner.user_name}</p>
          <p className="text-sm text-charcoal-500">
            {winner.draw_month
              ? new Date(winner.draw_month).toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })
              : "Draw"}{" "}
            · {winner.match_tier}-number match · ₹{winner.prize_amount.toLocaleString()}
          </p>
        </div>
        <Badge tone={statusTone[winner.status]}>{winner.status}</Badge>
      </div>

      {proofUrl && (
        <a
          href={proofUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-sage-600 hover:underline"
        >
          View proof screenshot →
        </a>
      )}

      {winner.status === "pending" && (
        <div className="mt-4 flex gap-3">
          <form action={updateWinnerStatus}>
            <input type="hidden" name="winnerId" value={winner.id} />
            <input type="hidden" name="status" value="approved" />
            <SubmitButton variant="primary" size="sm" pendingText="Saving…">
              Approve
            </SubmitButton>
          </form>
          <form action={updateWinnerStatus}>
            <input type="hidden" name="winnerId" value={winner.id} />
            <input type="hidden" name="status" value="rejected" />
            <SubmitButton variant="outline" size="sm" className="text-danger" pendingText="Saving…">
              Reject
            </SubmitButton>
          </form>
        </div>
      )}

      {winner.status === "approved" && (
        <div className="mt-4">
          <form action={updateWinnerStatus}>
            <input type="hidden" name="winnerId" value={winner.id} />
            <input type="hidden" name="status" value="paid" />
            <SubmitButton variant="accent" size="sm" pendingText="Saving…">
              Mark as paid
            </SubmitButton>
          </form>
        </div>
      )}
    </Card>
  );
}
