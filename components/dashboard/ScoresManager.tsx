"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Score } from "@/types/database";
import { addScore, updateScore, deleteScore } from "@/lib/actions/scores";
import type { ActionState } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { Label, Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/Misc";
import { Badge } from "@/components/ui/Badge";

const initialState: ActionState = {};
const today = () => new Date().toISOString().slice(0, 10);

export function ScoresManager({ scores }: { scores: Score[] }) {
  const [addState, addAction] = useActionState(addScore, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (addState.success) formRef.current?.reset();
  }, [addState.success]);

  return (
    <div className="space-y-8">
      <Card>
        <p className="font-display text-lg text-charcoal-900">Log a round</p>
        <p className="mt-1 text-sm text-charcoal-500">
          Stableford score, 1–45. We automatically keep your latest five.
        </p>
        <form ref={formRef} action={addAction} className="mt-5 flex flex-wrap items-end gap-4">
          <div className="w-36">
            <Label htmlFor="score">Score</Label>
            <Input id="score" name="score" type="number" min={1} max={45} required />
          </div>
          <div className="w-48">
            <Label htmlFor="playedOn">Date played</Label>
            <Input id="playedOn" name="playedOn" type="date" max={today()} defaultValue={today()} required />
          </div>
          <SubmitButton pendingText="Saving…">Add score</SubmitButton>
        </form>
        {addState.error && (
          <div className="mt-4">
            <FormMessage tone="error">{addState.error}</FormMessage>
          </div>
        )}
        {addState.success && (
          <div className="mt-4">
            <FormMessage tone="success">{addState.success}</FormMessage>
          </div>
        )}
      </Card>

      <div>
        <div className="flex items-center justify-between">
          <p className="font-display text-lg text-charcoal-900">Your last {scores.length} scores</p>
          <Badge tone="sage">{scores.length} / 5 slots used</Badge>
        </div>

        {scores.length === 0 ? (
          <p className="mt-4 text-sm text-charcoal-500">
            No scores logged yet — add your first round above.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {scores.map((score) => (
              <ScoreRow key={score.id} score={score} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreRow({ score }: { score: Score }) {
  const [editing, setEditing] = useState(false);
  const [state, action] = useActionState(updateScore, initialState);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- closes the row once the server action confirms the save
    if (state.success) setEditing(false);
  }, [state.success]);

  if (editing) {
    return (
      <Card className="p-4">
        <form action={action} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="id" value={score.id} />
          <div className="w-28">
            <Label htmlFor={`score-${score.id}`}>Score</Label>
            <Input
              id={`score-${score.id}`}
              name="score"
              type="number"
              min={1}
              max={45}
              defaultValue={score.score}
              required
            />
          </div>
          <div className="w-44">
            <Label htmlFor={`date-${score.id}`}>Date</Label>
            <Input
              id={`date-${score.id}`}
              name="playedOn"
              type="date"
              max={today()}
              defaultValue={score.played_on}
              required
            />
          </div>
          <SubmitButton size="sm" pendingText="Saving…">
            Save
          </SubmitButton>
          <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </form>
        {state.error && (
          <div className="mt-3">
            <FormMessage tone="error">{state.error}</FormMessage>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <p className="font-medium text-charcoal-900">{score.score} points</p>
        <p className="text-sm text-charcoal-500">
          {new Date(score.played_on).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <form action={deleteScore}>
          <input type="hidden" name="id" value={score.id} />
          <Button type="submit" variant="ghost" size="sm" className="text-danger">
            Delete
          </Button>
        </form>
      </div>
    </Card>
  );
}
