---
id: G100
title: Visa file audit log per-file view
workflow: W3
deps: ["G007", "G083"]
size: S
status: not_started
owner: claude_code
---

# G100 — Visa file audit log per-file view

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G007, G083
**Size:** S

## What

Per visa file, viewable audit trail: every action, who, when.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Tab on visa file detail: 'Audit trail'
2. Lists all AuditLog entries for this file
3. Sortable; filterable by action type
4. Export to PDF (feeds dossier)

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G100` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G100: Visa file audit log per-file view"`
Update `goals/_index.json` to mark this goal `done`.
