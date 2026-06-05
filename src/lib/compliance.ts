import { COMPLIANCE_GUARDS, type ComplianceGuard } from "./reference/scripts";

/** Match composed text against compliance guard keyword lists (CLAUDE.md §8). */
export function checkGuards(text: string): ComplianceGuard | null {
  const lower = text.toLowerCase();
  for (const g of COMPLIANCE_GUARDS) {
    if (g.keywords.some((k) => lower.includes(k.toLowerCase()))) return g;
  }
  return null;
}
