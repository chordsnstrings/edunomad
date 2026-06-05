---
id: G004
title: Multi-tenant data model — User, tenant scoping
workflow: W0
deps: ["G002"]
size: M
status: not_started
owner: claude_code
---

# G004 — Multi-tenant data model — User, tenant scoping

**Workflow:** W0 (Foundations)
**Dependencies:** G002
**Size:** M

## What

User entity with tenant + tenant_id + role. Every other entity inherits tenant scoping.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. User schema includes tenant enum, tenant_id, role enum, status
2. Migration runs cleanly
3. Helper query function withTenantScope() exists
4. Cross-tenant query without explicit allow returns empty set
5. Test covering tenant isolation passes

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G004` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G004: Multi-tenant data model — User, tenant scoping"`
Update `goals/_index.json` to mark this goal `done`.
