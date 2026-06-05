export const ATTRIBUTION_KEY = "en_attribution";

export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "referral_code",
  "fair_qr_token",
  "ref",
] as const;

export type Attribution = Record<string, string>;
