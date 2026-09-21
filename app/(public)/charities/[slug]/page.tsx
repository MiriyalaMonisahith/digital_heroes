import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCharityBySlug } from "@/lib/data/charities";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export default async function CharityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const charity = await getCharityBySlug(slug);

  if (!charity) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/charities" className="text-sm text-sage-600 hover:underline">
        ← All charities
      </Link>

      <div className="relative mt-6 h-56 w-full overflow-hidden rounded-3xl bg-sage-100 sm:h-72">
        {charity.image_url && (
          <Image src={charity.image_url} alt={charity.name} fill className="object-cover" />
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {charity.is_featured && <Badge tone="amber">Featured</Badge>}
        <Badge tone="sage">Charity</Badge>
      </div>

      <h1 className="mt-4 font-display text-3xl text-charcoal-900 sm:text-4xl">
        {charity.name}
      </h1>
      <p className="mt-2 text-lg text-charcoal-500">{charity.tagline}</p>

      <p className="mt-8 max-w-2xl whitespace-pre-line leading-relaxed text-charcoal-700">
        {charity.description || "More details coming soon."}
      </p>

      {charity.website && (
        <a
          href={charity.website}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm font-medium text-sage-600 hover:underline"
        >
          Visit website →
        </a>
      )}

      {charity.events.length > 0 && (
        <div className="mt-10">
          <p className="font-display text-xl text-charcoal-900">Upcoming events</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {charity.events.map((event, i) => (
              <Card key={i}>
                <p className="font-medium text-charcoal-900">{event.name}</p>
                <p className="mt-1 text-sm text-charcoal-500">
                  {event.date} · {event.location}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-2xl bg-sage-600 px-8 py-8 text-center">
        <p className="font-display text-xl text-cream">
          Subscribe and choose {charity.name} as your cause.
        </p>
        <div className="mt-5">
          <LinkButton href="/signup" variant="accent">
            Subscribe now
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
