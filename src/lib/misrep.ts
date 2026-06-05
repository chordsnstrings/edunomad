import type { ConsistencyCheck } from "./consistency";

export type MisrepFlag = { id: string; severity: "high" | "medium"; reason: string };

/** Surface potential misrepresentation from consistency failures (G082).
 *  Name mismatches are high severity — they go straight to Compliance. */
export function detectMisrepFlags(consistency: { checks: ConsistencyCheck[] }): MisrepFlag[] {
  return consistency.checks
    .filter((c) => !c.consistent)
    .map((c) => ({ id: c.field, severity: c.field === "name" ? "high" : "medium", reason: `${c.field}: ${c.note}` }));
}
