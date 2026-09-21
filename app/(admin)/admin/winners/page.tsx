import { getAllWinnersForAdmin } from "@/lib/data/admin";
import { WinnerRow } from "@/components/admin/WinnerRow";
import { EmptyState } from "@/components/ui/Misc";

export default async function AdminWinnersPage() {
  const winners = await getAllWinnersForAdmin();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Winners</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">Winner verification</h1>
      <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
        Review submitted proof screenshots, approve or reject claims, and mark payouts as
        completed.
      </p>

      <div className="mt-8 space-y-4">
        {winners.length === 0 ? (
          <EmptyState title="No winners yet" description="Publish a draw to generate winners." />
        ) : (
          winners.map((w) => <WinnerRow key={w.id} winner={w} />)
        )}
      </div>
    </div>
  );
}
