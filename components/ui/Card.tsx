import { cn } from "@/lib/cn";

export function Card({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-cream-card p-6 shadow-[0_1px_2px_rgba(35,41,31,0.04),0_8px_24px_-16px_rgba(35,41,31,0.25)]",
        className
      )}
      {...rest}
    />
  );
}

export function CardDark({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-pine-800 p-6 text-cream shadow-[0_8px_28px_-14px_rgba(0,0,0,0.5)]",
        className
      )}
      {...rest}
    />
  );
}
