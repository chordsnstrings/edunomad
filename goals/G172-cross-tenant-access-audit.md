---
id: G172
title: Cross-tenant access audit
workflow: W7
deps: ["G006"]
size: S
status: not_started
owner: claude_code
---

# G172 — Cross-tenant access audit

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G006
**Size:** S

## What

Filter audit log to cross-tenant access entries. Compliance can review patterns.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Filter in audit log explorer: cross_tenant only
2. Per-entry shows: actor, source tenant, target tenant, reason
3. Surfaces unusual patterns

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G172` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G172: Cross-tenant access audit"`
Update `goals/_index.json` to mark this goal `done`.
