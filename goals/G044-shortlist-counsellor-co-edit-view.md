---
id: G044
title: Shortlist counsellor co-edit view
workflow: W1
deps: ["G043"]
size: M
status: not_started
owner: claude_code
---

# G044 — Shortlist counsellor co-edit view

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G043
**Size:** M

## What

Counsellor sees student's shortlist. Can recommend add/remove with rationale visible to student.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Counsellor sees same shortlist + reach/match/safe categorisation
2. Counsellor can add programme with rationale → appears as 'recommended by counsellor'
3. Counsellor can suggest removal; student decides
4. Visible diff: what counsellor recommended vs what student has
5. Recommendation events emitted

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G044` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G044: Shortlist counsellor co-edit view"`
Update `goals/_index.json` to mark this goal `done`.
