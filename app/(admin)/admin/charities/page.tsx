import { getAllCharitiesForAdmin } from "@/lib/data/admin";
import { CharityManager } from "@/components/admin/CharityManager";

export default async function AdminCharitiesPage() {
  const charities = await getAllCharitiesForAdmin();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">Charities</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal-900">Charity management</h1>
      <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
        Add, edit, or retire charities. Featured charities appear on the homepage
        spotlight.
      </p>

      <div className="mt-8">
        <CharityManager charities={charities} />
      </div>
    </div>
  );
}
