---
id: G024
title: Profile builder step 4 — field of study
workflow: W1
deps: ["G023"]
size: S
status: not_started
owner: claude_code
---

# G024 — Profile builder step 4 — field of study

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G023
**Size:** S

## What

Two-step picker: broad category → narrower subcategory.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 10 broad categories from reference
2. Subcategories appear after broad selection
3. Save fires on subcategory selection
4. Search/filter at category level
5. Progress bar 4/6

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G024` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G024: Profile builder step 4 — field of study"`
Update `goals/_index.json` to mark this goal `done`.
