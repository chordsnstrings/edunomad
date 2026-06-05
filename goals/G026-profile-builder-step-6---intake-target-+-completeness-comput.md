---
id: G026
title: Profile builder step 6 — intake target + completeness computation
workflow: W1
deps: ["G025"]
size: M
status: not_started
owner: claude_code
---

# G026 — Profile builder step 6 — intake target + completeness computation

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G025
**Size:** M

## What

Intake target picker. On submit, compute completeness_pct. Emit profile.completed.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 3 options: next viable / specific intake / undecided
2. Specific reveals month/year picker
3. On submit: completeness_pct computed (≥95% when all fields present)
4. profile.completed event emitted
5. Redirects to eligibility screen
6. Progress bar 6/6 then disappears

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G026` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G026: Profile builder step 6 — intake target + completeness computation"`
Update `goals/_index.json` to mark this goal `done`.
