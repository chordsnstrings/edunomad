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
