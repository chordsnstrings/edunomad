import type { UserRole, Tenant } from "@prisma/client";
import { logAudit } from "./audit";

// Scope vocabulary (CLAUDE.md §6). `true` means allowed with no row scoping.
type Scope =
  | "all"
  | "own"
  | "own_assigned"
  | "own_team"
  | "own_invited_to"
  | "own_pre_lock"
  | "own_assigned_pre_lock";
type Perm = Scope | true;
type EntityPerms = Record<string, Perm>;
type RolePerms = Record<string, EntityPerms>;

/**
 * Server-side permission matrix for the 10 Phase-1 roles, mirroring
 * docs/03-rbac.md / CLAUDE.md §6. Deny by default: anything not listed here
 * is denied.
 */
export const MATRIX: Partial<Record<UserRole, RolePerms>> = {
  super_admin: {
    user: { view: "all", create: "all", edit: "all", delete: "all" },
    role_assignment: { view: "all", create: "all", edit: "all", delete: "all" },
    audit_log: { view: "all" },
    integration_config: { view: "all", create: "all", edit: "all", delete: "all" },
    backup: { view: "all", create: "all", edit: "all" },
    data_export: { view: "all", create: "all" },
    student: { view: "all" },
    application: { view: "all" },
    visa_file: { view: "all" },
    payment: { view: "all" },
  },
  education_manager: {
    student: { view: "all" },
    application: { view: "all" },
    visa_file: { view: "all" },
    counsellor: { view: "own_team" },
    operations_member: { view: "own_team" },
    kpi_dashboard: { view: "all" },
    partner_university: { view: "all", approve: true },
    financial_summary: { view: "all" },
    exception_approval: { view: "all", approve: true },
    sop: { view: "all", edit: "own_assigned", approve: true },
    escalation: { view: "all", approve: true },
  },
  counsellor_manager: {
    student: { view: "own_team", edit: "own_team" },
    application: { view: "own_team" },
    counsellor: { view: "own_team", edit: "own_team" },
    lead_routing: { view: "own_team", create: "own_team", edit: "own_team", approve: true },
    qa_review: { view: "own_team", create: "own_team", edit: "own_team", approve: true },
    escalation: { view: "own_team", edit: "own_team", approve: true },
    refund_request: { view: "own_team", edit: "own_team", approve: true },
  },
  counsellor: {
    student: { view: "own_assigned", edit: "own_assigned" },
    application: { view: "own_assigned", edit: "own_assigned_pre_lock" },
    shortlist: {
      view: "own_assigned", create: "own_assigned",
      edit: "own_assigned_pre_lock", delete: "own_assigned_pre_lock",
    },
    document: { view: "own_assigned" },
    sop_draft: { view: "own_assigned", edit: "own_assigned_pre_lock" },
    message: { view: "own_assigned", create: "own_assigned" },
    call: { view: "own_assigned", create: "own_assigned" },
    note: { view: "own_assigned", create: "own_assigned", edit: "own_assigned" },
    escalation: { view: "own_assigned", create: "own_assigned" },
  },
  operations_manager: {
    student: { view: "all" },
    application: { view: "all", edit: "own_team", approve: true },
    visa_file: { view: "all", edit: "own_team", approve: true },
    operations_member: { view: "own_team", edit: "own_team" },
    template: { view: "all", edit: "all", approve: true },
    checklist: { view: "all", edit: "all", approve: true },
    partner_uni_sla: { view: "all", edit: "all" },
  },
  operations_team: {
    student: { view: "own_assigned" },
    application: { view: "own_assigned", edit: "own_assigned" },
    visa_file: { view: "own_assigned", create: "own_assigned", edit: "own_assigned" },
    document: { view: "own_assigned", edit: "own_assigned", approve: true },
    sop_polish: { view: "own_assigned", edit: "own_assigned" },
    submission: { view: "own_assigned", create: "own_assigned" },
  },
  compliance: {
    visa_file: { view: "all", approve: true },
    audit_log: { view: "all" },
    regulatory_bulletin: { view: "all", create: "all", edit: "own_assigned" },
    misrepresentation_flag: { view: "all", create: "all", edit: "own_assigned", approve: true },
    regulator_notification: { view: "own_assigned", create: "own_assigned", edit: "own_assigned" },
    training_log: { view: "all" },
  },
  finance: {
    payment: { view: "all", create: "all", edit: "own_assigned", approve: true },
    invoice: { view: "all", create: "all", edit: "own_assigned" },
    commission: { view: "all", create: "all", edit: "own_assigned", approve: true },
    payout: { view: "all", create: "all", edit: "own_assigned", approve: true },
    refund: { view: "all", edit: "own_assigned", approve: true },
    financial_report: { view: "all", create: "all" },
    student: { view: "all" },
  },
  student: {
    student_self: { view: "own", edit: "own", delete: "own" },
    profile: { view: "own", create: "own", edit: "own" },
    application: { view: "own", approve: true },
    shortlist: { view: "own", create: "own", edit: "own_pre_lock", delete: "own_pre_lock", approve: "own" },
    document: { view: "own", create: "own" },
    sop_draft: { view: "own", create: "own", edit: "own_pre_lock", approve: "own" },
    payment: { view: "own", create: "own", approve: "own" },
    message: { view: "own", create: "own" },
    parent_invite: { view: "own", create: "own", delete: "own" },
    complaint: { view: "own", create: "own" },
  },
  parent: {
    student_assigned: { view: "own_invited_to" },
    application: { view: "own_invited_to" },
    payment: { view: "own_invited_to", create: "own_invited_to", approve: "own_invited_to" },
    message: { view: "own_invited_to", create: "own_invited_to" },
    complaint: { view: "own", create: "own" },
  },
};

/** Actions always written to the audit log, even when allowed (CLAUDE.md §6). */
const PRIVILEGED = new Set([
  "payment.approve",
  "payout.approve",
  "refund.approve",
  "visa_file.approve",
  "exception.approve",
  "exception_approval.approve",
  "regulator_notification.create",
  "user.delete",
  "role_assignment.create",
]);

export type AuthUser = {
  id: string;
  role: UserRole;
  tenant: Tenant;
  tenantId: string;
  teamMemberIds?: string[];
};

export type AuthTarget = {
  id?: string;
  tenantId?: string;
  ownerId?: string;
  assignedToId?: string;
  invitedUserIds?: string[];
  locked?: boolean;
};

export type AuthzRequest = {
  user: AuthUser;
  action: string;
  entity: string;
  target?: AuthTarget;
  crossTenant?: boolean;
};

function evalScope(scope: Scope, user: AuthUser, target?: AuthTarget): boolean {
  switch (scope) {
    case "all":
      return true;
    case "own":
      return !!target && target.ownerId === user.id;
    case "own_assigned":
      return !!target && target.assignedToId === user.id;
    case "own_team":
      return (
        !!target &&
        !!target.ownerId &&
        (user.teamMemberIds ?? []).includes(target.ownerId)
      );
    case "own_invited_to":
      return !!target && (target.invitedUserIds ?? []).includes(user.id);
    case "own_pre_lock":
      return !!target && target.ownerId === user.id && target.locked !== true;
    case "own_assigned_pre_lock":
      return !!target && target.assignedToId === user.id && target.locked !== true;
  }
}

/** Pure permission check (no logging). */
export function can(req: AuthzRequest): { allowed: boolean; reason?: string } {
  const perm = MATRIX[req.user.role]?.[req.entity]?.[req.action];
  if (perm === undefined) return { allowed: false, reason: "no permission defined (deny by default)" };

  if (
    req.target?.tenantId &&
    req.target.tenantId !== req.user.tenantId &&
    !req.crossTenant
  ) {
    return { allowed: false, reason: "cross-tenant access without explicit allow" };
  }

  const allowed = perm === true ? true : evalScope(perm, req.user, req.target);
  return allowed ? { allowed: true } : { allowed: false, reason: `scope '${perm}' not satisfied` };
}

/**
 * Authorise an action. Returns a boolean and writes audit entries for denials
 * (always) and for privileged / explicit cross-tenant actions (even allowed).
 */
export async function authorize(req: AuthzRequest): Promise<boolean> {
  const { allowed, reason } = can(req);
  const actionKey = `${req.entity}.${req.action}`;
  const crossTenant =
    req.crossTenant &&
    req.target?.tenantId &&
    req.target.tenantId !== req.user.tenantId;

  if (!allowed) {
    await logAudit({
      actorUserId: req.user.id,
      action: actionKey,
      targetType: req.entity,
      targetId: req.target?.id ?? null,
      result: "denied",
      reason,
    });
  } else if (PRIVILEGED.has(actionKey) || crossTenant) {
    await logAudit({
      actorUserId: req.user.id,
      action: actionKey,
      targetType: req.entity,
      targetId: req.target?.id ?? null,
      result: "success",
      reason: crossTenant ? "cross-tenant explicit allow" : "privileged action",
    });
  }
  return allowed;
}
