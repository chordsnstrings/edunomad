---
id: G043
title: Shortlist builder UI — add/remove programmes
workflow: W1
deps: ["G028"]
size: M
status: not_started
owner: claude_code
---

# G043 — Shortlist builder UI — add/remove programmes

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G028
**Size:** M

## What

Student picks programmes from eligibility result. Rationale captured per choice. Max 6 active.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Add from eligibility result via button
2. Remove from shortlist with confirm
3. Rationale text field per choice (saved on blur)
4. Counter: 'X of 6'
5. Cannot add 7th — error message
6. shortlist.programme_added / shortlist.programme_removed events

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G043` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G043: Shortlist builder UI — add/remove programmes"`
Update `goals/_index.json` to mark this goal `done`.
