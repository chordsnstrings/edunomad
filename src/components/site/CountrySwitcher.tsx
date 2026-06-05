"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Globe } from "lucide-react";
import { setCountry } from "@/app/actions";
import { flagEmoji, cn } from "@/lib/utils";

type Option = { code: string; name: string };

export function CountrySwitcher({
  countries,
  currentCode,
  isOverride,
}: {
  countries: Option[];
  currentCode: string;
  isOverride: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

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
    startTransition(async () => {
      await setCountry(code);
      router.refresh();
    });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose your country"
        disabled={pending}
        className={cn(
          "inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-white px-2.5 text-sm font-medium text-navy transition-colors hover:bg-subtle",
          pending && "opacity-60",
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
