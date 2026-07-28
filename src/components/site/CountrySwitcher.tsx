"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Globe } from "lucide-react";
import { flagEmoji, cn } from "@/lib/utils";
import { useVisitorContact } from "./VisitorContact";

/**
 * Country picker for the per-country contact numbers. Reads and writes the
 * visitor's country entirely on the client (see VisitorContactProvider) so the
 * public site can stay statically rendered.
 */
export function CountrySwitcher() {
  const visitor = useVisitorContact();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const countries = (visitor?.countries ?? []).map((c) => ({
    code: c.countryCode,
    name: c.countryName,
  }));
  const currentCode = visitor?.isOverride ? visitor.code : "";
  const isOverride = visitor?.isOverride ?? false;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function choose(code: string) {
    setOpen(false);
    visitor?.choose(code);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose your country"
        className={cn(
          "inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-white px-2.5 text-sm font-medium text-navy transition-colors hover:bg-subtle",
        )}
      >
        <span aria-hidden className="text-base leading-none">
          {currentCode ? flagEmoji(currentCode) : <Globe className="h-4 w-4" />}
        </span>
        <span className="hidden xs:inline">{currentCode || "Region"}</span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 max-h-80 w-60 overflow-auto rounded-xl border border-line bg-white p-1.5 shadow-lg shadow-black/5"
        >
          <p className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            Show numbers for
          </p>
          <button
            type="button"
            role="option"
            aria-selected={!isOverride}
            onClick={() => choose("")}
            className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-subtle"
          >
            <span className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted" /> Auto-detect (by location)
            </span>
            {!isOverride && <Check className="h-4 w-4 text-gold-600" />}
          </button>
          <div className="my-1 h-px bg-line" />
          {countries.map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={isOverride && c.code === currentCode}
              onClick={() => choose(c.code)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-subtle"
            >
              <span className="inline-flex items-center gap-2">
                <span aria-hidden>{flagEmoji(c.code)}</span>
                {c.name}
              </span>
              {isOverride && c.code === currentCode && (
                <Check className="h-4 w-4 text-gold-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
