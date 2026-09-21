"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type ActionState } from "@/lib/actions/auth";
import { Label, Input } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/Misc";

const initialState: ActionState = {};

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">
        Welcome back
      </p>
      <h1 className="mt-2 font-display text-2xl text-charcoal-900">Log in</h1>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </div>

        {state.error && <FormMessage tone="error">{state.error}</FormMessage>}

        <SubmitButton pendingText="Logging in…" className="w-full">
          Log in
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal-500">
        New here?{" "}
        <Link href="/signup" className="font-medium text-sage-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
