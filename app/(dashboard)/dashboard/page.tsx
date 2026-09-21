import { getCurrentUser } from "@/lib/auth";
import { getSubscriberOverview } from "@/lib/data/dashboard";
import { StatTile } from "@/components/ui/StatTile";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Misc";

const statusTone: Record<string, "sage" | "amber" | "danger" | "neutral"> = {
  active: "sage",
  inactive: "neutral",
  cancelled: "danger",
  lapsed: "amber",
};

export default async function DashboardOverviewPage() {
  const session = await getCurrentUser();
  const userId = session!.authUser.id;
  const overview = await getSubscriberOverview(userId);
  const { subscription, charity, scores, drawsEntered, upcomingDraw, winners, totalWon } =
    overview;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Overview</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">
        Welcome back{session?.profile?.full_name ? `, ${session.profile.full_name.split(" ")[0]}` : ""}.
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Subscription"
          value={
            <Badge tone={statusTone[subscription?.status ?? "inactive"]}>
              {subscription?.status ?? "inactive"}
            </Badge>
          }
          hint={
            subscription?.status === "active" && subscription.renews_at
              ? `Renews ${new Date(subscription.renews_at).toLocaleDateString()}`
              : "Subscribe to join the draw"
          }
        />
        <StatTile label="Scores logged" value={`${scores.length} / 5`} />
        <StatTile label="Draws entered" value={drawsEntered} hint={upcomingDraw ? "Next draw is open" : "No draw open yet"} />
        <StatTile label="Total won" value={`₹${totalWon.toLocaleString()}`} tone="dark" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="font-display text-lg text-charcoal-900">Your charity</p>
          {charity ? (
            <>
              <p className="mt-2 text-sm text-charcoal-700">{charity.name}</p>
              <p className="mt-1 text-sm text-charcoal-500">{charity.tagline}</p>
              <p className="mt-3 text-sm text-charcoal-500">
                Contribution:{" "}
                <span className="font-medium text-charcoal-900">
                  {subscription?.charity_percentage ?? 10}%
                </span>{" "}
                of your subscription
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-charcoal-500">
              You haven&rsquo;t chosen a charity yet.
            </p>
          )}
          <div className="mt-4">
            <LinkButton href="/dashboard/subscription" variant="outline" size="sm">
              Manage subscription
            </LinkButton>
          </div>
        </Card>

        <Card>
          <p className="font-display text-lg text-charcoal-900">Recent scores</p>
          {scores.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                title="No scores yet"
                description="Log a round to get in the next draw."
                action={
                  <LinkButton href="/dashboard/scores" size="sm">
                    Add a score
                  </LinkButton>
                }
              />
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {scores.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-charcoal-500">
                    {new Date(s.played_on).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-charcoal-900">{s.score} pts</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {winners.length > 0 && (
        <div className="mt-10">
          <p className="font-display text-lg text-charcoal-900">Winnings</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {winners.map((w) => (
              <Card key={w.id}>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-charcoal-900">
                    {w.draw_month ? new Date(w.draw_month).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Draw"}
                  </p>
                  <Badge tone={w.status === "paid" ? "sage" : w.status === "rejected" ? "danger" : "amber"}>
                    {w.status}
                  </Badge>
                </div>
                <p className="mt-2 font-display text-2xl text-charcoal-900">
                  ₹{w.prize_amount.toLocaleString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
