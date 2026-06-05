import type { Tenant } from "@prisma/client";

/** The tenant a request is acting within. Default scope for every query. */
export type TenantContext = { tenant: Tenant; tenantId: string };

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
