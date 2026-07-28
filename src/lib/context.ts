import { cache } from "react";
import {
  getSettings,
  getEnabledCountryContacts,
  resolveContact,
} from "./settings";
import { detectCountry } from "./geo";

/**
 * Resolve everything the public site needs for a request, once.
 * React.cache dedupes this across the layout and the page in a single render.
 */
/**
 * Request-independent site context: settings + the enabled country list + the
 * DEFAULT contact. Reads no cookies/headers, so pages using it can be statically
 * rendered (and CDN-cached). The visitor's actual country is applied on the
 * client — see components/site/VisitorContact.tsx.
 */
export const getStaticSiteContext = cache(async () => {
  const [settings, countries] = await Promise.all([
    getSettings(),
    getEnabledCountryContacts(),
  ]);
  return {
    settings,
    countries,
    defaultContact: {
      phone: settings.defaultPhone,
      whatsapp: settings.defaultWhatsapp,
      countryCode: settings.defaultCountryCode,
      countryName: settings.country,
      displayName: "",
      source: "default" as const,
    },
  };
});

/** Request-scoped context (reads cookies/geo headers) — forces dynamic rendering. */
export const getSiteContext = cache(async () => {
  const settings = await getSettings();
  const detected = await detectCountry();
  const [contact, countries] = await Promise.all([
    resolveContact(detected.code || null),
    getEnabledCountryContacts(),
  ]);
  return {
    settings,
    detected,
    contact,
    countries,
    isOverride: detected.source === "override",
  };
});
