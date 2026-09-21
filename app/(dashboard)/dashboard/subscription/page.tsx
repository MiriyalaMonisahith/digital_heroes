import { getCurrentUser, getCurrentSubscription } from "@/lib/auth";
import { getAllCharities } from "@/lib/data/charities";
import { SubscriptionForm } from "@/components/dashboard/SubscriptionForm";
import { cancelSubscription } from "@/lib/actions/subscription";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/Misc";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  const session = await getCurrentUser();
  const [subscription, charities] = await Promise.all([
    getCurrentSubscription(session!.authUser.id),
    getAllCharities(),
  ]);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Subscription</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">Plan &amp; charity</h1>

      {welcome && (
        <div className="mt-4">
          <FormMessage tone="success">
            Account created! Pick a plan and a charity to start your first month.
          </FormMessage>
        </div>
      )}

      <div className="mt-8 max-w-xl space-y-6">
        <SubscriptionForm charities={charities} subscription={subscription} />

        {subscription?.status === "active" && (
          <form action={cancelSubscription}>
            <Button type="submit" variant="outline" className="text-danger">
              Cancel subscription
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
