---
id: G159
title: Audit log explorer UI
workflow: W7
deps: ["G007"]
size: M
status: not_started
owner: claude_code
---

# G159 — Audit log explorer UI

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G007
**Size:** M

## What

/compliance/audit. Search by actor, action type, target, date range.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Search filters: actor, action, target, date range
2. Paginated results
3. Per-row: actor, action, target, before/after diff (jsonb), IP, UA, timestamp
4. Export to CSV or PDF
5. RBAC: compliance + super_admin only

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G159` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G159: Audit log explorer UI"`
Update `goals/_index.json` to mark this goal `done`.
