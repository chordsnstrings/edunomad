/**
 * Cookie names shared by server and client code.
 *
 * Kept free of next/headers (and any other server-only import) so client
 * components can reference them without pulling server APIs into the bundle.
 */
export const COUNTRY_COOKIE = "en_country";
export const LOCALE_COOKIE = "en_locale";
