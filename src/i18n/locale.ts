import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

export const LOCALE_COOKIE = "en_locale";

/** Resolve the active locale: cookie override → Accept-Language → default. */
export async function detectLocale(): Promise<Locale> {
  const store = await cookies();
  const override = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(override)) return override;

  const h = await headers();
  const accept = h.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.trim().split(/[-;]/)[0];
    if (isLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}
