---
id: G116
title: CM lead routing override interface
workflow: W5
deps: ["G098"]
size: S
status: not_started
owner: claude_code
---

# G116 — CM lead routing override interface

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G098
**Size:** S

## What

CM can override auto-routing on overnight batch.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Overnight assignments visible as a batch
2. Override action per lead: reassign to specific counsellor
3. counsellor.reassigned event emitted
4. Reason field captured

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G116` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G116: CM lead routing override interface"`
Update `goals/_index.json` to mark this goal `done`.
