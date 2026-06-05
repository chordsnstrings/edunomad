"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Accessible switch backed by a real checkbox so it posts with the form. */
export function Toggle({
  name,
  defaultChecked,
  label,
  hint,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
  hint?: string;
}) {
  const [on, setOn] = useState(Boolean(defaultChecked));
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
      <span className="relative inline-flex shrink-0 pt-0.5">
        <input
          type="checkbox"
          name={name}
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "h-6 w-11 rounded-full border border-line bg-subtle transition-colors",
            on && "border-navy bg-navy",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-0.5 top-1 h-5 w-5 rounded-full bg-white transition-transform",
            on && "translate-x-5",
          )}
        />
      </span>
    </label>
  );
}
