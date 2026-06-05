// Curated country list for the admin picker and contact resolution.
// Covers EduNomad's source markets, destinations, and major diaspora hubs.
export type Country = { code: string; name: string; dial: string };

export const COUNTRIES: Country[] = [
  // South Asia (source markets)
  { code: "BD", name: "Bangladesh", dial: "+880" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "NP", name: "Nepal", dial: "+977" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "LK", name: "Sri Lanka", dial: "+94" },
  { code: "BT", name: "Bhutan", dial: "+975" },
  { code: "MV", name: "Maldives", dial: "+960" },
  // Destinations
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  // Middle East (diaspora)
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "KW", name: "Kuwait", dial: "+965" },
  { code: "OM", name: "Oman", dial: "+968" },
  { code: "BH", name: "Bahrain", dial: "+973" },
  // SE / East Asia
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "JP", name: "Japan", dial: "+81" },
  // Africa
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "GH", name: "Ghana", dial: "+233" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "TZ", name: "Tanzania", dial: "+255" },
  { code: "UG", name: "Uganda", dial: "+256" },
  // Other
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "TR", name: "Türkiye", dial: "+90" },
];

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export function getCountry(code?: string | null): Country | undefined {
  if (!code) return undefined;
  return BY_CODE.get(code.toUpperCase());
}

export function countryName(code?: string | null): string {
  return getCountry(code)?.name ?? code ?? "";
}
