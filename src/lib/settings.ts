import { cache } from "react";
import type { SiteSettings, CountryContact } from "@prisma/client";
import { prisma } from "./db";

export const SINGLETON_ID = "singleton";
export type { SiteSettings, CountryContact };

/** Fetch the singleton settings row, creating it with defaults on first run. */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const existing = await prisma.siteSettings.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (existing) return existing;
  return prisma.siteSettings.create({ data: { id: SINGLETON_ID } });
});

/** All country contacts (admin view — includes disabled). */
export const getAllCountryContacts = cache(
  async (): Promise<CountryContact[]> =>
    prisma.countryContact.findMany({
      orderBy: [{ sortOrder: "asc" }, { countryName: "asc" }],
    }),
);

/** Enabled country contacts only (public-facing). */
export const getEnabledCountryContacts = cache(
  async (): Promise<CountryContact[]> =>
    prisma.countryContact.findMany({
      where: { enabled: true },
      orderBy: [{ sortOrder: "asc" }, { countryName: "asc" }],
    }),
);

export type ResolvedContact = {
  phone: string;
  whatsapp: string;
  countryCode: string;
  countryName: string;
  displayName: string;
  source: "country" | "default";
};

/**
 * Resolve the contact numbers for a visitor's country, falling back to the
 * global defaults when there's no enabled match.
 */
export async function resolveContact(
  countryCode?: string | null,
): Promise<ResolvedContact> {
  const settings = await getSettings();
  if (settings.geoEnabled && countryCode) {
    const match = await prisma.countryContact.findFirst({
      where: { countryCode: countryCode.toUpperCase(), enabled: true },
    });
    if (match) {
      return {
        phone: match.phone,
        whatsapp: match.whatsapp,
        countryCode: match.countryCode,
        countryName: match.countryName,
        displayName: match.displayName,
        source: "country",
      };
    }
  }
  return {
    phone: settings.defaultPhone,
    whatsapp: settings.defaultWhatsapp,
    countryCode: settings.defaultCountryCode,
    countryName: settings.country,
    displayName: "",
    source: "default",
  };
}
