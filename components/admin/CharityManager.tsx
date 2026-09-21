"use client";

import { useState } from "react";
import Image from "next/image";
import type { Charity } from "@/types/database";
import { deleteCharity } from "@/lib/actions/admin-charities";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CharityForm } from "@/components/admin/CharityForm";

export function CharityManager({ charities }: { charities: Charity[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <p className="font-display text-lg text-charcoal-900">Charities</p>
          {!adding && (
            <Button size="sm" onClick={() => setAdding(true)}>
              Add charity
            </Button>
          )}
        </div>
        {adding && (
          <div className="mt-5 border-t border-border pt-5">
            <CharityForm onDone={() => setAdding(false)} />
          </div>
        )}
      </Card>

      <div className="space-y-4">
        {charities.map((charity) =>
          editingId === charity.id ? (
            <Card key={charity.id}>
              <CharityForm charity={charity} onDone={() => setEditingId(null)} />
            </Card>
          ) : (
            <Card key={charity.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sage-100">
                  {charity.image_url && (
                    <Image src={charity.image_url} alt={charity.name} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-charcoal-900">{charity.name}</p>
                    {charity.is_featured && <Badge tone="amber">Featured</Badge>}
                  </div>
                  <p className="text-sm text-charcoal-500">{charity.tagline}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingId(charity.id)}>
                  Edit
                </Button>
                <form action={deleteCharity}>
                  <input type="hidden" name="id" value={charity.id} />
                  <Button type="submit" variant="ghost" size="sm" className="text-danger">
                    Delete
                  </Button>
                </form>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
