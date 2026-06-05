---
id: G007
title: AuditLog entity + hash chain
workflow: W0
deps: ["G002"]
size: M
status: not_started
owner: claude_code
---

# G007 — AuditLog entity + hash chain

**Workflow:** W0 (Foundations)
**Dependencies:** G002
**Size:** M

## What

AuditLog table — append-only, hash-chained like events. logAudit() helper for privileged actions and permission denials.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. AuditLog schema matches docs/01-data-model.md
2. logAudit() helper computes chain_hash like events
3. INSERT only — UPDATE/DELETE blocked
4. Query endpoint for Compliance + Super Admin returns paginated logs
5. Export to CSV with hash-chain proof appended
6. Integrity check function verifies chain end-to-end

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G007` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G007: AuditLog entity + hash chain"`
Update `goals/_index.json` to mark this goal `done`.
