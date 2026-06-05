---
id: G022
title: Profile builder step 2 — English proficiency
workflow: W1
deps: ["G021"]
size: S
status: not_started
owner: claude_code
---

# G022 — Profile builder step 2 — English proficiency

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G021
**Size:** S

## What

Single-select among 4 options + conditional score field.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 4 options: in_hand / planning / moi / none
2. in_hand reveals score field with test type select
3. moi reveals MOI letter note
4. Save fires on selection
5. Progress bar 2/6

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G022` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G022: Profile builder step 2 — English proficiency"`
Update `goals/_index.json` to mark this goal `done`.
