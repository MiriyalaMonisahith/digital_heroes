"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type ActionState } from "@/lib/actions/auth";
import { Label, Input, FieldHint } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/Misc";

const initialState: ActionState = {};

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, initialState);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">
        Join Digital Heroes
      </p>
      <h1 className="mt-2 font-display text-2xl text-charcoal-900">Create your account</h1>
      <FieldHint>
        Demo mode — subscribing next won&rsquo;t charge a real card.
      </FieldHint>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" autoComplete="name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <FieldHint>At least 8 characters.</FieldHint>
        </div>

        {state.error && <FormMessage tone="error">{state.error}</FormMessage>}

        <SubmitButton pendingText="Creating account…" className="w-full">
          Create account
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal-500">
        Already subscribed?{" "}
        <Link href="/login" className="font-medium text-sage-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
