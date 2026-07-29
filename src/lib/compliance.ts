import { COMPLIANCE_GUARDS, type ComplianceGuard } from "./reference/scripts";
import { sopComplianceGuards } from "./sop-runtime";

/** Match composed text against compliance guard keyword lists (CLAUDE.md §8). */
export function checkGuards(
  text: string,
  extra: readonly ComplianceGuard[] = [],
): ComplianceGuard | null {
  const lower = text.toLowerCase();
  for (const g of [...COMPLIANCE_GUARDS, ...extra]) {
    if (g.keywords.some((k) => lower.includes(k.toLowerCase()))) return g;
  }
  return null;
}

/**
 * Server-side guard check, including keywords managers published through the
 * SOP CMS. The composer checked guards in the browser only, so a request that
 * skipped the UI — or a template variable carrying the phrase — sent an
 * unauthorised promise with no flag raised. Section 10's rule for permissions
 * applies here too: the UI hints, the server decides.
 */
export async function checkGuardsServer(text: string): Promise<ComplianceGuard | null> {
  const authored = await sopComplianceGuards().catch(() => []);
  return checkGuards(text, authored as ComplianceGuard[]);
}
