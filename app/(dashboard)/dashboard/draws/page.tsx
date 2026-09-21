import { getCurrentUser } from "@/lib/auth";
import { getUpcomingDraw, getPublishedDraws, getMyResultsByDraw, getMyEntryNumbers } from "@/lib/data/draws";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Misc";

function formatMonth(month: string) {
  return new Date(month).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export default async function DrawsPage() {
  const session = await getCurrentUser();
  const userId = session!.authUser.id;

  const [upcoming, published, myResults, myNumbers] = await Promise.all([
    getUpcomingDraw(),
    getPublishedDraws(),
    getMyResultsByDraw(userId),
    getMyEntryNumbers(userId),
  ]);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Draws</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">Draw history</h1>

      <div className="mt-8">
        <p className="font-display text-lg text-charcoal-900">This month</p>
        {upcoming ? (
          <Card className="mt-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-charcoal-900">{formatMonth(upcoming.month)}</p>
              <Badge tone="amber">Open — not yet drawn</Badge>
            </div>
            <p className="mt-3 text-sm text-charcoal-500">Your numbers this month</p>
            <div className="mt-2 flex gap-2">
              {myNumbers.length > 0 ? (
                myNumbers.map((n) => (
                  <span
                    key={n}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-600 text-sm font-semibold text-cream"
                  >
                    {n}
                  </span>
                ))
              ) : (
                <p className="text-sm text-charcoal-500">
                  Log a score to get your numbers for this draw.
                </p>
              )}
            </div>
          </Card>
        ) : (
          <div className="mt-4">
            <EmptyState
              title="No draw open yet"
              description="Check back once the admin team opens the next month's draw."
            />
          </div>
        )}
      </div>

      <div className="mt-10">
        <p className="font-display text-lg text-charcoal-900">Past draws</p>
        {published.length === 0 ? (
          <p className="mt-4 text-sm text-charcoal-500">No draws have been published yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {published.map((draw) => {
              const result = myResults[draw.id];
              return (
                <Card key={draw.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-charcoal-900">{formatMonth(draw.month)}</p>
                    {result?.match_tier ? (
                      <Badge tone="amber">
                        {result.match_tier}-number match · ₹{result.prize_amount.toLocaleString()}
                      </Badge>
                    ) : (
                      <Badge tone="neutral">No match</Badge>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {(draw.winning_numbers ?? []).map((n) => (
                      <span
                        key={n}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-pine-800 text-xs font-semibold text-cream"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-wide text-charcoal-500">
                    Total pool ₹{draw.pool_total.toLocaleString()} · {draw.entrant_count} entrants
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
