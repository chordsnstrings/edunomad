---
id: G120
title: CM 1:1 module — fixed agenda checklist
workflow: W5
deps: ["G115"]
size: M
status: not_started
owner: claude_code
---

# G120 — CM 1:1 module — fixed agenda checklist

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G115
**Size:** M

## What

1:1 with counsellor: fixed agenda from SOP loaded as checklist + notes editor.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 1:1 session for one counsellor
2. Fixed agenda checkboxes (pipeline review, QA themes, training needs, escalations, growth, blockers, action items)
3. Notes captured against counsellor.notes_thread
4. Rolling history visible across past 1:1s

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G120` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G120: CM 1:1 module — fixed agenda checklist"`
Update `goals/_index.json` to mark this goal `done`.
