import { cn } from "@/lib/cn";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-cream px-6 py-12 text-center">
      <p className="font-display text-xl text-charcoal-900">{title}</p>
      {description && <p className="mt-2 text-sm text-charcoal-500">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function FormMessage({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "rounded-xl px-4 py-3 text-sm",
        tone === "success" ? "bg-sage-100 text-sage-700" : "bg-danger-50 text-danger"
      )}
    >
      {children}
    </p>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}
