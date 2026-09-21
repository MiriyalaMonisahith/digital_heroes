import { cn } from "@/lib/cn";

type Tone = "sage" | "amber" | "danger" | "neutral";

const toneClasses: Record<Tone, string> = {
  sage: "bg-sage-100 text-sage-700",
  amber: "bg-amber-400/40 text-amber-600",
  danger: "bg-danger-50 text-danger",
  neutral: "bg-sand text-charcoal-700",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
