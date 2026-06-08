"use client";

import { createContext, useContext } from "react";
import { translate } from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

/**
 * Client-side locale context. Server components call `getTranslator(locale)`
 * directly; client components read the active locale from here via `useT()`.
 * The locale is resolved on the server (user's chosen language, else cookie /
 * Accept-Language) and handed down per surface.
 */
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Bound translator for client components: `const t = useT(); t("key", vars)`. */
export function useT() {
  const locale = useContext(LocaleContext);
  return (key: string, vars?: Record<string, unknown>) => translate(locale, key, vars);
}
