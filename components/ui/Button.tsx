import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-sage-600 text-cream hover:bg-sage-700 focus-visible:outline-sage-700",
  accent:
    "bg-amber-500 text-pine-900 hover:bg-amber-600 focus-visible:outline-amber-600",
  outline:
    "bg-transparent text-charcoal-900 border border-border hover:bg-cream-card focus-visible:outline-sage-500",
  ghost:
    "bg-transparent text-charcoal-700 hover:bg-cream-card focus-visible:outline-sage-500",
  danger: "bg-danger text-cream hover:opacity-90 focus-visible:outline-danger",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-3.5 py-1.5 rounded-full",
  md: "text-sm px-5 py-2.5 rounded-full",
  lg: "text-base px-7 py-3.5 rounded-full",
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = "primary", size = "md", className, ...rest }: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...rest} />;
}

interface LinkButtonProps extends React.ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: LinkButtonProps) {
  return <Link className={buttonClasses(variant, size, className)} {...rest} />;
}
