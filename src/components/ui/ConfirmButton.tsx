"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Destructive action with an in-app confirmation step.
 *
 * Replaces window.confirm(), which is blocking, unstyleable, announces in the
 * browser's language rather than the user's (this app ships four), and on some
 * mobile browsers can be suppressed entirely — silently turning a guarded action
 * into an unguarded one.
 */
export function ConfirmButton({
  onConfirm,
  confirmLabel,
  cancelLabel = "Cancel",
  children,
  className,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  onConfirm: () => void | Promise<void>;
  confirmLabel: string;
  cancelLabel?: string;
}) {
  const [asking, setAsking] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (asking) confirmRef.current?.focus();
  }, [asking]);

  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <span role="group" aria-label={confirmLabel} className="inline-flex items-center gap-1.5">
      <button
        ref={confirmRef}
        type="button"
        onClick={async () => {
          setAsking(false);
          await onConfirm();
        }}
        onKeyDown={(e) => e.key === "Escape" && setAsking(false)}
        className="min-h-[44px] rounded-lg bg-red-600 px-3 text-sm font-semibold text-white hover:bg-red-700"
      >
        {confirmLabel}
      </button>
      <button
        type="button"
        onClick={() => setAsking(false)}
        className="min-h-[44px] rounded-lg border border-line px-3 text-sm font-medium text-navy hover:bg-subtle"
      >
        {cancelLabel}
      </button>
    </span>
  );
}
