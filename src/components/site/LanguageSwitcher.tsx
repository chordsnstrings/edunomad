"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Languages } from "lucide-react";
import { setLocale } from "@/app/actions";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ current: initial }: { current?: Locale }) {
  // The public shell is static, so the active locale is read from the cookie
  // on the client rather than during server render.
  const [current, setCurrent] = useState<Locale>(initial ?? "en");
  useEffect(() => {
    const c = document.cookie.match(/(?:^|; )en_locale=([^;]*)/)?.[1];
    if (c && (LOCALES as readonly string[]).includes(c)) setCurrent(c as Locale);
  }, []);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function choose(locale: Locale) {
    setOpen(false);
    setCurrent(locale);
    startTransition(async () => {
      await setLocale(locale);
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
        aria-label="Choose language"
        disabled={pending}
        className={cn(
          "inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-white px-2.5 text-sm font-medium text-navy hover:bg-subtle",
          pending && "opacity-60",
        )}
      >
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">{LOCALE_LABELS[current]}</span>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-line bg-white p-1.5 shadow-lg shadow-black/5"
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              role="option"
              aria-selected={l === current}
              onClick={() => choose(l)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-subtle"
            >
              {LOCALE_LABELS[l]}
              {l === current && <Check className="h-4 w-4 text-gold-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
