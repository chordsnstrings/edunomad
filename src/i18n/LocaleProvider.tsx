"use client";

import { createContext, useContext, useMemo } from "react";
import { IntlMessageFormat } from "intl-messageformat";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export type Messages = Record<string, string>;

/**
 * Client-side locale context. Server components call `getTranslator(locale)`
 * directly; client components read the active locale from here via `useT()`.
 *
 * The messages are handed in per surface rather than imported. Importing them
 * pulled `MESSAGES` — all four catalogues — into a shared client chunk that
 * every page referenced, marketing pages and the 404 included: a student in
 * Dhaka on 4G downloaded the Hindi and Nepali strings before seeing the
 * homepage. Only the active locale now travels, and only where a provider is
 * actually mounted.
 */
const LocaleContext = createContext<{ locale: Locale; messages: Messages }>({
  locale: DEFAULT_LOCALE,
  messages: {},
});

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  /** The active locale's catalogue. Omit only where nothing below calls `useT`. */
  messages?: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, messages: messages ?? {} }), [locale, messages]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

const formatterCache = new Map<string, IntlMessageFormat>();

function format(locale: Locale, raw: string, vars?: Record<string, unknown>): string {
  const cacheKey = `${locale} ${raw}`;
  try {
    let f = formatterCache.get(cacheKey);
    if (!f) {
      f = new IntlMessageFormat(raw, locale);
      formatterCache.set(cacheKey, f);
    }
    return String(f.format(vars ?? {}));
  } catch {
    // Degrade gracefully if a message has malformed ICU syntax.
    return raw.replace(/\{(\w+)\}/g, (_, k: string) =>
      vars && k in vars ? String(vars[k]) : `{${k}}`,
    );
  }
}

/** Bound translator for client components: `const t = useT(); t("key", vars)`. */
export function useT() {
  const { locale, messages } = useContext(LocaleContext);
  return (key: string, vars?: Record<string, unknown>) => {
    const raw = messages[key];
    if (raw === undefined) {
      if (process.env.NODE_ENV !== "production") {
        // A missing key here means the surface mounted a provider without the
        // catalogue, which renders raw keys to the user — loud in dev, silent
        // fallback in production.
        console.warn(`[i18n] no client message for "${key}" (${locale})`);
      }
      return key;
    }
    return format(locale, raw, vars);
  };
}
