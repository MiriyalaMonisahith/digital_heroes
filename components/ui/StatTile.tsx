import { cn } from "@/lib/cn";

export function StatTile({
  label,
  value,
  hint,
  tone = "light",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        tone === "light"
          ? "border-border bg-cream-card"
          : "border-transparent bg-pine-800 text-cream"
      )}
    >
      <p
        className={cn(
          "text-xs font-medium uppercase tracking-wide",
          tone === "light" ? "text-charcoal-500" : "text-sage-300"
        )}
      >
        {label}
      </p>
      <p className="mt-2 font-display text-3xl">{value}</p>
      {hint && (
        <p
          className={cn(
            "mt-1 text-xs",
            tone === "light" ? "text-charcoal-500" : "text-cream/70"
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
