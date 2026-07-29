import type { Tenant } from "@prisma/client";

/** The tenant a request is acting within. Default scope for every query. */
export type TenantContext = { tenant: Tenant; tenantId: string };

/**
 * Phase 1 runs exactly one instance of each tenant type, so the ids are stable
 * constants rather than provisioned uuids. They exist as constants because
 * four call sites had each invented their own value — a student's `tenantId`
 * was variously their own uuid, the inviting student's id, or the literal
 * "student" — which made the cross-tenant check in `can()` fire or not fire
 * depending on which code path had written the row.
 *
 * Phase 2 provisions real per-agency / per-partner ids; these become the
 * defaults for the EduNomad-operated tenant rather than the only values.
 */
export const TENANT_ID: Record<Tenant, string> = {
  edunomad: "edunomad",
  student: "student",
  agency: "agency",
  service_partner: "service_partner",
};

/**
 * The tenant that owns a book of business. A Student, Application, VisaFile or
 * Invoice belongs to the organisation *doing the work* — EduNomad in Phase 1,
 * an agency in Phase 2 — not to the student's own account tenant. `User.tenant`
 * describes where the person signs in; this describes who owns the record.
 */
export const OPERATING_TENANT_ID = TENANT_ID.edunomad;

/**
 * Scope a Prisma `where` clause to the caller's tenant (CLAUDE.md §1.9).
 * Cross-tenant access must be opted into explicitly AND audited by the caller
 * (CLAUDE.md §6 cross-cutting rules) — passing `crossTenant` skips the scope.
 */
export function withTenantScope<W extends Record<string, unknown>>(
  ctx: TenantContext,
  where?: W,
  opts?: { crossTenant?: boolean },
): W & { tenantId?: string } {
  const base = (where ?? {}) as W & { tenantId?: string };
  if (opts?.crossTenant) return base;
  return { ...base, tenantId: ctx.tenantId };
}

/**
 * Scope a business-data query to the tenant whose book of business it is.
 * Staff read and write their own tenant's records; a student's records live in
 * the same tenant, which is why a counsellor can see them at all.
 */
export function withOperatingScope<W extends Record<string, unknown>>(
  where?: W,
): W & { tenantId: string } {
  return { ...((where ?? {}) as W), tenantId: OPERATING_TENANT_ID };
}
