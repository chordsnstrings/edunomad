---
id: G027
title: Eligibility match engine
workflow: W1
deps: ["G026", "G002"]
size: L
status: not_started
owner: claude_code
---

# G027 — Eligibility match engine

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G026, G002
**Size:** L

## What

Service: Student → matched Programmes as reach/match/safe. Considers academic, English, destinations, budget.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Returns 3 buckets: reach, match, safe
2. English filter applied with MOI/Duolingo alternatives
3. Budget filter applied
4. Destination filter applied
5. Returns within 5s for 400+ programmes
6. eligibility.checked event emitted

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G027` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G027: Eligibility match engine"`
Update `goals/_index.json` to mark this goal `done`.
