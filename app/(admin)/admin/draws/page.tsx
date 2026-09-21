import { getAllDrawsForAdmin } from "@/lib/data/admin";
import { CreateDrawForm } from "@/components/admin/CreateDrawForm";
import { DrawCard } from "@/components/admin/DrawCard";
import { EmptyState } from "@/components/ui/Misc";

export default async function AdminDrawsPage() {
  const draws = await getAllDrawsForAdmin();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Draws</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">Draw management</h1>
      <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
        Create a draw, simulate it as many times as you like to preview outcomes, then
        publish once you&rsquo;re happy — publishing locks in results and notifies winners.
      </p>

      <div className="mt-8">
        <CreateDrawForm />
      </div>

      <div className="mt-8 space-y-4">
        {draws.length === 0 ? (
          <EmptyState title="No draws yet" description="Create the first one above." />
        ) : (
          draws.map((draw) => <DrawCard key={draw.id} draw={draw} />)
        )}
      </div>
    </div>
  );
}
