---
id: G006
title: RBAC middleware — server-side enforcement
workflow: W0
deps: ["G004"]
size: L
status: not_started
owner: claude_code
---

# G006 — RBAC middleware — server-side enforcement

**Workflow:** W0 (Foundations)
**Dependencies:** G004
**Size:** L

## What

Authorisation middleware. Reads (role, entity, action, target), looks up permissions, evaluates scope. Logs denials and privileged actions.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. authorize({user, action, entity, target}) returns boolean
2. All 10 active roles' permissions encoded in single config (mirrors docs/03-rbac.md)
3. Scope resolvers: own, own_assigned, own_team, own_invited_to, own_assigned_pre_lock, all
4. Denials log to AuditLog with result=denied
5. Privileged actions log to AuditLog even when allowed
6. Cross-tenant requires explicit allow + logs reason
7. Deny by default — unknown tuple returns false

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G006` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G006: RBAC middleware — server-side enforcement"`
Update `goals/_index.json` to mark this goal `done`.
