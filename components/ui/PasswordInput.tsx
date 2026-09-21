"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded-xl border border-border bg-cream py-2.5 pl-4 pr-11 text-sm text-charcoal-900 placeholder:text-charcoal-300 outline-none transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-100";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
>(function PasswordInput({ className, ...rest }, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn(fieldBase, className)}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-charcoal-400 transition-colors hover:text-charcoal-600"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
});

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M9.9 5.09A10.94 10.94 0 0 1 12 5c7 0 10.5 7 10.5 7a13.16 13.16 0 0 1-2.16 3.19m-3.35 2.36A10.9 10.9 0 0 1 12 19c-7 0-10.5-7-10.5-7A13.13 13.13 0 0 1 4.68 8.49" />
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    </svg>
  );
}
