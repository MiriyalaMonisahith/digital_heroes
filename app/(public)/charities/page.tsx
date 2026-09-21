import { getAllCharities } from "@/lib/data/charities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CharityDirectory } from "@/components/charities/CharityDirectory";

export default async function CharitiesPage() {
  const charities = await getAllCharities();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        eyebrow="Charity directory"
        title="Choose who you're"
        italic="playing for."
        description="Every charity here gets a share of subscriber fees. Browse profiles, upcoming golf days, and pick the one that speaks to you at signup."
      />
      <div className="mt-10">
        <CharityDirectory charities={charities} />
      </div>
    </div>
  );
}
