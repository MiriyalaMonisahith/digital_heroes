import type { Draw } from "@/types/database";
import { simulateDrawAction, publishDrawAction } from "@/lib/actions/admin-draws";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SubmitButton } from "@/components/ui/SubmitButton";

const statusTone = {
  draft: "neutral",
  simulated: "amber",
  published: "sage",
} as const;

function formatMonth(month: string) {
  return new Date(month).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function DrawCard({ draw }: { draw: Draw }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg text-charcoal-900">{formatMonth(draw.month)}</p>
        <div className="flex items-center gap-2">
          <Badge tone="neutral">{draw.draw_type}</Badge>
          <Badge tone={statusTone[draw.status]}>{draw.status}</Badge>
        </div>
      </div>

      {draw.winning_numbers && draw.winning_numbers.length > 0 && (
        <div className="mt-4 flex gap-2">
          {draw.winning_numbers.map((n) => (
            <span
              key={n}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-pine-800 text-sm font-semibold text-cream"
            >
              {n}
            </span>
          ))}
        </div>
      )}

      {draw.status !== "draft" && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-charcoal-500">Entrants</p>
            <p className="font-medium text-charcoal-900">{draw.entrant_count}</p>
          </div>
          <div>
            <p className="text-charcoal-500">Pool total</p>
            <p className="font-medium text-charcoal-900">₹{draw.pool_total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-charcoal-500">5/4/3 split</p>
            <p className="font-medium text-charcoal-900">
              ₹{draw.pool_5.toLocaleString()} / ₹{draw.pool_4.toLocaleString()} / ₹
              {draw.pool_3.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-charcoal-500">Rollover out</p>
            <p className="font-medium text-charcoal-900">₹{draw.jackpot_rollover_out.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-3">
        {draw.status !== "published" && (
          <form action={simulateDrawAction}>
            <input type="hidden" name="drawId" value={draw.id} />
            <SubmitButton variant="outline" size="sm" pendingText="Simulating…">
              {draw.status === "draft" ? "Simulate" : "Re-simulate"}
            </SubmitButton>
          </form>
        )}
        {draw.status === "simulated" && (
          <form action={publishDrawAction}>
            <input type="hidden" name="drawId" value={draw.id} />
            <SubmitButton variant="accent" size="sm" pendingText="Publishing…">
              Publish
            </SubmitButton>
          </form>
        )}
      </div>
    </Card>
  );
}
