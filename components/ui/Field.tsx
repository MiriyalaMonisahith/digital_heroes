import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-300 outline-none transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-100";

export function Label({ className, ...rest }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-charcoal-700", className)}
      {...rest}
    />
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(fieldBase, className)} {...rest} />;
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn(fieldBase, "min-h-28 resize-y", className)} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...rest }, ref) {
    return <select ref={ref} className={cn(fieldBase, className)} {...rest} />;
  }
);

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs text-danger">{children}</p>;
}

export function FieldHint({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs text-charcoal-500">{children}</p>;
}
