---
id: G023
title: Profile builder step 3 — destinations ranked
workflow: W1
deps: ["G022"]
size: S
status: not_started
owner: claude_code
---

# G023 — Profile builder step 3 — destinations ranked

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G022
**Size:** S

## What

Multi-select destinations with drag-to-reorder.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 4 destination cards
2. Selected appear in ranked list
3. Drag-to-reorder on mobile (touch) + desktop
4. Save fires on each change; ranked array
5. Progress bar 3/6

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G023` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G023: Profile builder step 3 — destinations ranked"`
Update `goals/_index.json` to mark this goal `done`.
