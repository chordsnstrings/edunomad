/**
 * Static FX rates to USD for finance reporting (Phase 1). A real deployment
 * would pull live rates from a provider; these are conservative approximations
 * kept in one place so reporting normalises consistently to USD.
 */
export const CURRENCIES = [
  "USD",
  "CAD",
  "GBP",
  "AUD",
  "MYR",
  "BDT",
  "INR",
  "NPR",
] as const;
export type Currency = (typeof CURRENCIES)[number];

const USD_PER: Record<Currency, number> = {
  USD: 1,
  CAD: 0.73,
  GBP: 1.27,
  AUD: 0.66,
  MYR: 0.22,
  BDT: 0.0091,
  INR: 0.012,
  NPR: 0.0075,
};

/** Country (destination) → the currency its commissions are paid in. */
export function countryCurrency(country: string): Currency {
  return (
    { CA: "CAD", UK: "GBP", AU: "AUD", MY: "MYR" } as Record<string, Currency>
  )[country] ?? "USD";
}

/** Convert a whole-unit amount in `currency` to whole USD. */
export function toUsd(amount: number, currency: string): number {
  const rate = USD_PER[currency as Currency] ?? 1;
  return Math.round(amount * rate);
}

/** Convert whole USD into whole units of `currency`. */
export function fromUsd(amountUsd: number, currency: string): number {
  const rate = USD_PER[currency as Currency] ?? 1;
  return Math.round(amountUsd / rate);
}

/** Localized currency string, e.g. "CA$3,400" / "$3,400". */
export function fmtMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}
