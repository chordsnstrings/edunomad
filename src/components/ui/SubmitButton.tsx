"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Submit button that disables itself while its form's server action is in
 * flight.
 *
 * No form in the app had a pending state, so a second tap on a slow connection
 * fired the action again — the exact conditions this product runs in. Server-side
 * guards make the critical writes idempotent, but the user still needs to see
 * that their tap registered rather than tapping again.
 */
export function SubmitButton({
  children,
  pendingLabel,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      aria-busy={pending}
      className={cn(className, pending && "pointer-events-none opacity-60")}
      {...props}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
