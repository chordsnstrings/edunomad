---
id: G025
title: Profile builder step 5 — budget
workflow: W1
deps: ["G024"]
size: S
status: not_started
owner: claude_code
---

# G025 — Profile builder step 5 — budget

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G024
**Size:** S

## What

Annual budget range + funding source free-text.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Min/max budget inputs in USD with helper text
2. Funding source free-text
3. Save fires on blur
4. Helper microcopy emphasises honesty
5. Progress bar 5/6

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G025` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G025: Profile builder step 5 — budget"`
Update `goals/_index.json` to mark this goal `done`.
