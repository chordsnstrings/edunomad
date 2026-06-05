# RBAC matrix

> Mirror of CLAUDE.md Section 6 with extra detail. This file is the
> source of truth for permission middleware generation.

See `CLAUDE.md` Section 6 for the full per-role matrix. This file adds:

## Action semantics

- `view`: read a record (list or detail)
- `create`: insert a new record
- `edit`: update an existing record's mutable fields
- `delete`: soft-delete or hard-delete per the entity's policy
- `approve`: a workflow-level approval action (sign-off, accept, lock,
  approve payment, etc.)

## Scope semantics

- `own`: the user is the subject of the record (user_id matches)
- `own_assigned`: the record's `assigned_*_id` matches the user
- `own_team`: the record belongs to a user this user manages (manager_id chain)
- `own_tenant`: same tenant_id as the user
- `own_invited_to`: the user is in the record's invited_users list
- `own_assigned_pre_lock`: assigned record where shortlist_status != 'locked'
- `all`: unrestricted within the user's tenant
- `false`: action denied for this role

## Deny-by-default

If a (role, entity, action) tuple is not explicitly listed in the matrix
or the role's section, the answer is `false`. The middleware should
treat unknown tuples as denied and log to AuditLog with `result: denied`.

## Privileged actions — extra audit logging

These actions always log to AuditLog regardless of result:
- `payment.approve`
- `payout.approve`
- `refund.approve`
- `visa_file.approve` (sign-off)
- `exception.approve`
- `regulator_notification.create`
- `user.delete`
- `role_assignment.create`
- `role_assignment.edit`
- `integration_config.edit`

## Cross-tenant access

Cross-tenant access requires:
1. An explicit allow rule (no scope shortcuts)
2. An AuditLog entry with `result: success` and `reason: cross_tenant_access`
3. Approval by an Education Manager or Super Admin

## How permissions middleware should work

For every API request:

1. Identify the actor (User from session).
2. Identify the (entity, action, target) being requested.
3. Look up `permissions[actor.role][entity][action]`.
4. If `false` or missing: deny, log to AuditLog with `result: denied`,
   return 403.
5. If a scope (`own`, `own_assigned`, etc.): verify the target's
   ownership / assignment / tenancy matches the scope. If not, deny + log.
6. If `all`: allow, but if the action is privileged, log to AuditLog.
7. Allow the request to proceed.
