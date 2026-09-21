"use client";

import { useActionState, useState } from "react";
import type { Charity, Subscription } from "@/types/database";
import { subscribe } from "@/lib/actions/subscription";
import { PLAN_PRICE } from "@/lib/plans";
import type { ActionState } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { Label, Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/Misc";
import { cn } from "@/lib/cn";

const initialState: ActionState = {};

export function SubscriptionForm({
  charities,
  subscription,
}: {
  charities: Charity[];
  subscription: Subscription | null;
}) {
  const [state, formAction] = useActionState(subscribe, initialState);
  const [plan, setPlan] = useState<"monthly" | "yearly">(subscription?.plan ?? "monthly");
  const [percentage, setPercentage] = useState(subscription?.charity_percentage ?? 10);

  const isActive = subscription?.status === "active";

  return (
    <Card>
      <p className="font-display text-lg text-charcoal-900">
        {isActive ? "Update your subscription" : "Choose your plan"}
      </p>
      <p className="mt-1 text-sm text-charcoal-500">
        Demo mode — clicking subscribe activates your account instantly, no card needed.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <Label>Plan</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["monthly", "yearly"] as const).map((p) => (
              <label
                key={p}
                className={cn(
                  "cursor-pointer rounded-xl border p-4 transition-colors",
                  plan === p ? "border-sage-500 bg-sage-50" : "border-border bg-cream"
                )}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p}
                  checked={plan === p}
                  onChange={() => setPlan(p)}
                  className="sr-only"
                />
                <p className="text-sm font-semibold capitalize text-charcoal-900">{p}</p>
                <p className="mt-1 font-display text-xl text-charcoal-900">
                  ₹{PLAN_PRICE[p].toLocaleString()}
                  <span className="text-sm font-sans text-charcoal-500">
                    /{p === "monthly" ? "mo" : "yr"}
                  </span>
                </p>
                {p === "yearly" && (
                  <p className="mt-1 text-xs text-sage-600">Best value — 2 months free</p>
                )}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="charityId">Your charity</Label>
          <Select
            id="charityId"
            name="charityId"
            defaultValue={subscription?.charity_id ?? ""}
            required
          >
            <option value="" disabled>
              Choose a charity…
            </option>
            {charities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="charityPercentage">Charity contribution</Label>
            <span className="text-sm font-medium text-sage-600">{percentage}%</span>
          </div>
          <input
            id="charityPercentage"
            name="charityPercentage"
            type="range"
            min={10}
            max={100}
            step={5}
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full accent-sage-600"
          />
          <p className="mt-1 text-xs text-charcoal-500">
            Minimum 10% of your subscription — increase it any time.
          </p>
        </div>

        {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
        {state.success && <FormMessage tone="success">{state.success}</FormMessage>}

        <SubmitButton variant="accent" pendingText="Processing…">
          {isActive ? "Update subscription" : "Subscribe"}
        </SubmitButton>
      </form>
    </Card>
  );
}
