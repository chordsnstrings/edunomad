---
id: G133
title: Voluntary attrition / exit interview log
workflow: W5
deps: []
size: S
status: not_started
owner: claude_code
---

# G133 — Voluntary attrition / exit interview log

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** (none)
**Size:** S

## What

When counsellor leaves: exit interview captured; cases auto-reassigned.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Exit interview entity
2. Cases automatically routed to other team members
3. Notes thread archived
4. Audit log entry

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G133` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G133: Voluntary attrition / exit interview log"`
Update `goals/_index.json` to mark this goal `done`.
