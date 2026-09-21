import { getAdminOverview } from "@/lib/data/admin";
import { StatTile } from "@/components/ui/StatTile";
import { Card } from "@/components/ui/Card";
import { CharityContributionChart } from "@/components/admin/CharityContributionChart";

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Reports</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">Platform overview</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile label="Total users" value={overview.totalUsers} tone="dark" />
        <StatTile label="Active subscribers" value={overview.activeSubscribers} />
        <StatTile
          label="Total prize pool"
          value={`₹${overview.totalPrizePool.toLocaleString()}`}
        />
        <StatTile
          label="Charity contributions"
          value={`₹${overview.totalCharityContributions.toLocaleString()}`}
        />
        <StatTile label="Draws published" value={overview.drawsPublished} />
        <StatTile label="Winners pending review" value={overview.pendingWinners} />
      </div>

      <div className="mt-8">
        <Card>
          <p className="font-display text-lg text-charcoal-900">Charity contribution totals</p>
          <div className="mt-5">
            <CharityContributionChart data={overview.charityBreakdown} />
          </div>
        </Card>
      </div>
    </div>
  );
}
