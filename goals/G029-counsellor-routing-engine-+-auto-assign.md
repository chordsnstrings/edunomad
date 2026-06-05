---
id: G029
title: Counsellor routing engine + auto-assign
workflow: W1
deps: ["G026", "G018"]
size: L
status: not_started
owner: claude_code
---

# G029 — Counsellor routing engine + auto-assign

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G026, G018
**Size:** L

## What

On profile.completed, route Student to Counsellor. Emit counsellor.assigned.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Routing function returns best Counsellor or null
2. Scoring: language (40%) × destination (25%) × load (20%) × lead_score (15%)
3. Counsellors >130% capacity excluded
4. Tie-break by tenure
5. Assignment + event within 5s of profile.completed
6. If null, route to Counsellor Manager queue

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G029` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G029: Counsellor routing engine + auto-assign"`
Update `goals/_index.json` to mark this goal `done`.
