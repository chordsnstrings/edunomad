---
id: G046
title: Student status timeline (9-stage)
workflow: W1
deps: ["G018"]
size: M
status: not_started
owner: claude_code
---

# G046 — Student status timeline (9-stage)

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G018
**Size:** M

## What

Visual timeline of 9 stages with current stage highlighted. Derived from event history.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 9 stages from CLAUDE.md §5
2. Current stage highlighted; past stages show check mark; future stages dim
3. Tap stage → expanded view of events in that stage
4. Renders correctly across all stages of a journey (test with seeded data)
5. Updates within 1s of new event

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G046` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G046: Student status timeline (9-stage)"`
Update `goals/_index.json` to mark this goal `done`.
