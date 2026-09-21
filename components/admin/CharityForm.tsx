"use client";

import { useActionState, useEffect, useRef } from "react";
import type { Charity } from "@/types/database";
import { upsertCharity } from "@/lib/actions/admin-charities";
import type { ActionState } from "@/lib/actions/auth";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/Misc";

const initialState: ActionState = {};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CharityForm({
  charity,
  onDone,
}: {
  charity?: Charity;
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState(upsertCharity, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {charity && <input type="hidden" name="id" value={charity.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={charity?.name}
            required
            onChange={(e) => {
              if (!charity && slugRef.current && !slugRef.current.dataset.touched) {
                slugRef.current.value = slugify(e.target.value);
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            ref={slugRef}
            defaultValue={charity?.slug}
            required
            onChange={() => {
              if (slugRef.current) slugRef.current.dataset.touched = "1";
            }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={charity?.tagline} maxLength={160} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={charity?.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" type="url" defaultValue={charity?.website ?? ""} />
        </div>
        <div>
          <Label htmlFor="image">Image</Label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-charcoal-700 file:mr-3 file:rounded-full file:border-0 file:bg-sage-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cream hover:file:bg-sage-700"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal-700">
        <input
          type="checkbox"
          name="isFeatured"
          defaultChecked={charity?.is_featured}
          className="h-4 w-4 accent-sage-600"
        />
        Feature on homepage
      </label>

      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
      {state.success && <FormMessage tone="success">{state.success}</FormMessage>}

      <div className="flex gap-3">
        <SubmitButton pendingText="Saving…">{charity ? "Save changes" : "Add charity"}</SubmitButton>
        {onDone && (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
