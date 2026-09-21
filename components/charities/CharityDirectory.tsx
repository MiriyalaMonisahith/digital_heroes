"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Charity } from "@/types/database";
import { Input } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Misc";

export function CharityDirectory({ charities }: { charities: Charity[] }) {
  const [query, setQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return charities.filter((c) => {
      if (featuredOnly && !c.is_featured) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [charities, query, featuredOnly]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search charities…"
          className="sm:max-w-xs"
        />
        <button
          onClick={() => setFeaturedOnly((v) => !v)}
          className="self-start"
          type="button"
        >
          <Badge tone={featuredOnly ? "amber" : "neutral"}>
            {featuredOnly ? "Showing featured only" : "Featured only"}
          </Badge>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No charities match your search"
            description="Try a different keyword or clear the featured filter."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((charity) => (
            <Link key={charity.id} href={`/charities/${charity.slug}`}>
              <Card className="h-full transition-transform hover:-translate-y-1">
                <div className="relative mb-4 h-32 w-full overflow-hidden rounded-xl bg-sage-100">
                  {charity.image_url && (
                    <Image
                      src={charity.image_url}
                      alt={charity.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  {charity.is_featured && (
                    <span className="absolute top-2 right-2">
                      <Badge tone="amber">Featured</Badge>
                    </span>
                  )}
                </div>
                <p className="font-display text-lg text-charcoal-900">{charity.name}</p>
                <p className="mt-1 text-sm text-charcoal-500">{charity.tagline}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
