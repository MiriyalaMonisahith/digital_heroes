import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  italic,
  description,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  italic?: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
            tone === "light" ? "text-sage-600" : "text-sage-300"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl sm:text-4xl",
          tone === "light" ? "text-charcoal-900" : "text-cream"
        )}
      >
        {title} {italic && <em className="text-sage-500 not-italic italic">{italic}</em>}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            tone === "light" ? "text-charcoal-700" : "text-cream/80"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
