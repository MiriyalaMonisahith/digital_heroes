"use client";

import { useActionState } from "react";
import { submitWinnerProof } from "@/lib/actions/winners";
import type { ActionState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/Misc";

const initialState: ActionState = {};

export function WinnerProofForm({ winnerId }: { winnerId: string }) {
  const [state, formAction] = useActionState(submitWinnerProof, initialState);

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <input type="hidden" name="winnerId" value={winnerId} />
      <input
        type="file"
        name="proof"
        accept="image/*"
        required
        className="block w-full text-sm text-charcoal-700 file:mr-3 file:rounded-full file:border-0 file:bg-sage-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cream hover:file:bg-sage-700"
      />
      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
      {state.success && <FormMessage tone="success">{state.success}</FormMessage>}
      <SubmitButton size="sm" pendingText="Uploading…">
        Upload proof screenshot
      </SubmitButton>
    </form>
  );
}
