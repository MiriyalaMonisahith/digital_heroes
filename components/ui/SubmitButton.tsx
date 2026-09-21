"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonVariant, type ButtonSize } from "@/components/ui/Button";

export function SubmitButton({
  children,
  pendingText = "Please wait…",
  variant,
  size,
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant={variant} size={size} className={className}>
      {pending ? pendingText : children}
    </Button>
  );
}
