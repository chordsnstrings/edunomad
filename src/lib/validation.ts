import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL (including https://)")
  .or(z.literal(""))
  .optional();

const optionalText = z.string().trim().optional().default("");

export const settingsSchema = z.object({
  // Brand
  companyName: z.string().trim().min(1, "Company name is required"),
  legalName: optionalText,
  tagline: optionalText,
  shortDescription: z.string().trim().max(300).optional().default(""),
  longDescription: optionalText,
  logoText: optionalText,
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
  foundingYear: z.coerce.number().int().min(1900).max(2100),

  // Default contact
  defaultCountryCode: z.string().trim().length(2).toUpperCase(),
  defaultPhone: z.string().trim().min(1, "A default phone number is required"),
  defaultWhatsapp: z
    .string()
    .trim()
    .min(1, "A default WhatsApp number is required"),
  email: z.string().trim().email("Enter a valid email"),
  supportEmail: z
    .string()
    .trim()
    .email("Enter a valid email")
    .or(z.literal(""))
    .optional(),
  addressLine: optionalText,
  city: optionalText,
  stateRegion: optionalText,
  postalCode: optionalText,
  country: optionalText,
  mapUrl: optionalUrl,
  businessHours: optionalText,

  // Social
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  twitterUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  whatsappCommunityUrl: optionalUrl,

  // SEO
  siteUrl: z.string().trim().url("Enter a valid URL"),
  metaTitle: z.string().trim().max(70, "Keep under ~60 characters for SEO"),
  metaDescription: z
    .string()
    .trim()
    .max(200, "Keep under ~160 characters for SEO"),
  metaKeywords: optionalText,
  ogImageUrl: optionalUrl,
  twitterHandle: optionalText,
  themeColor: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a hex colour like #0B1A2E"),

  // LLM SEO
  llmsSummary: optionalText,

  // Analytics
  gaMeasurementId: optionalText,
  gtmId: optionalText,
  plausibleDomain: optionalText,
  metaPixelId: optionalText,

  // Toggles
  showFloatingWhatsapp: z.coerce.boolean(),
  showFloatingCall: z.coerce.boolean(),
  geoEnabled: z.coerce.boolean(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const countrySchema = z.object({
  id: z.string().optional(),
  countryCode: z.string().trim().length(2, "Use a 2-letter code").toUpperCase(),
  countryName: z.string().trim().min(1, "Country name is required"),
  whatsapp: z.string().trim().min(1, "WhatsApp number is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  displayName: optionalText,
  languages: z.string().trim().optional().default("en"),
  note: optionalText,
  enabled: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().default(0),
});

export type CountryInput = z.infer<typeof countrySchema>;
