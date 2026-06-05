---
id: G021
title: Profile builder step 1 — academic background
workflow: W1
deps: ["G020", "G018"]
size: S
status: not_started
owner: claude_code
---

# G021 — Profile builder step 1 — academic background

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G020, G018
**Size:** S

## What

Form: qualification, board, percentage, year. Save-on-blur. Inline validation.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 4 fields render correctly
2. Save fires on blur; reflected in Student.academic jsonb
3. Validation: percentage 0-100 or GPA 0-10; year not future
4. Save latency ≤ 500ms
5. Back/save-and-exit buttons work; progress bar 1/6

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G021` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G021: Profile builder step 1 — academic background"`
Update `goals/_index.json` to mark this goal `done`.
