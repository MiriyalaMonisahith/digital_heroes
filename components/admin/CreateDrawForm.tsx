"use client";

import { useActionState, useEffect, useRef } from "react";
import { createDraw } from "@/lib/actions/admin-draws";
import type { ActionState } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { Label, Input, Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormMessage } from "@/components/ui/Misc";

const initialState: ActionState = {};

function nextMonthValue() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 7);
}

export function CreateDrawForm() {
  const [state, formAction] = useActionState(createDraw, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <Card>
      <p className="font-display text-lg text-charcoal-900">Open a new draw</p>
      <form ref={formRef} action={formAction} className="mt-4 flex flex-wrap items-end gap-4">
        <div className="w-44">
          <Label htmlFor="month">Month</Label>
          <Input id="month" name="month" type="month" defaultValue={nextMonthValue()} required />
        </div>
        <div className="w-48">
          <Label htmlFor="drawType">Draw type</Label>
          <Select id="drawType" name="drawType" defaultValue="random">
            <option value="random">Random</option>
            <option value="algorithmic">Algorithmic (weighted)</option>
          </Select>
        </div>
        <SubmitButton pendingText="Creating…">Create draw</SubmitButton>
      </form>
      {state.error && (
        <div className="mt-3">
          <FormMessage tone="error">{state.error}</FormMessage>
        </div>
      )}
      {state.success && (
        <div className="mt-3">
          <FormMessage tone="success">{state.success}</FormMessage>
        </div>
      )}
    </Card>
  );
}
