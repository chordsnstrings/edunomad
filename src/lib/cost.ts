import type { DestinationCountry } from "@prisma/client";

// Annual living + one-time costs (USD), per docs/05-reference/cost-components.md.
// proofOfFunds is a refundable deposit (GIC/blocked account), shown but not in total.
export const COST_COMPONENTS: Record<
  DestinationCountry,
  { livingPerYear: number; visa: number; insurancePerYear: number; flights: number; proofOfFunds: number }
> = {
  CA: { livingPerYear: 12000, visa: 235, insurancePerYear: 900, flights: 900, proofOfFunds: 20635 },
  UK: { livingPerYear: 13500, visa: 624, insurancePerYear: 1200, flights: 700, proofOfFunds: 12000 },
  AU: { livingPerYear: 16000, visa: 1100, insurancePerYear: 700, flights: 800, proofOfFunds: 0 },
  MY: { livingPerYear: 5000, visa: 160, insurancePerYear: 250, flights: 350, proofOfFunds: 0 },
};

export type CostBreakdown = {
  years: number;
  tuitionTotal: number;
  livingTotal: number;
  oneTime: number;
  total: number;
  proofOfFunds: number;
};

export function estimateTotalCost(
  country: DestinationCountry,
  tuitionPerYearUsd: number,
  durationMonths: number,
): CostBreakdown {
  const years = Math.max(1, Math.round(durationMonths / 12));
  const c = COST_COMPONENTS[country];
  const tuitionTotal = tuitionPerYearUsd * years;
  const livingTotal = c.livingPerYear * years;
  const oneTime = c.visa + c.flights + c.insurancePerYear * years;
  return {
    years,
    tuitionTotal,
    livingTotal,
    oneTime,
    total: tuitionTotal + livingTotal + oneTime,
    proofOfFunds: c.proofOfFunds,
  };
}
