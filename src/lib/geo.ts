import { cookies, headers } from "next/headers";

export const COUNTRY_COOKIE = "en_country";

/**
 * Resolve the visitor's country (ISO-3166 alpha-2).
 *
 * Priority:
 *  1. Manual override cookie (set by the country switcher).
 *  2. Edge/CDN geo headers injected by the platform from the visitor's IP
 *     (Vercel: x-vercel-ip-country, Cloudflare: cf-ipcountry, etc).
 *
 * Returns an empty code when undetectable so callers fall back to defaults.
 */
export async function detectCountry(): Promise<{
  code: string;
  source: "override" | "header" | "none";
}> {
  const cookieStore = await cookies();
  const override = cookieStore.get(COUNTRY_COOKIE)?.value;
  if (override) return { code: override.toUpperCase(), source: "override" };

  const h = await headers();
  const fromHeader =
    h.get("x-vercel-ip-country") ||
    h.get("cf-ipcountry") ||
    h.get("x-country") ||
    h.get("x-geo-country") ||
    h.get("x-appengine-country");

  if (fromHeader && fromHeader !== "XX" && fromHeader.length === 2) {
    return { code: fromHeader.toUpperCase(), source: "header" };
  }
  return { code: "", source: "none" };
}
