---
id: G045
title: Shortlist lock — quality gate
workflow: W1
deps: ["G043"]
size: M
status: not_started
owner: claude_code
---

# G045 — Shortlist lock — quality gate

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G043
**Size:** M

## What

Student taps Lock Shortlist. Quality gate enforces profile completeness ≥95% + all destinations have at least 1 programme.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Lock button visible with profile completeness display
2. Pre-lock check: completeness ≥95% AND ≥1 programme AND ≤6 programmes
3. If fail: blocking modal lists what's missing with deep links
4. On success: confirmation modal explaining handoff
5. shortlist.locked event emitted
6. Status changes prevent further shortlist edits

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G045` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G045: Shortlist lock — quality gate"`
Update `goals/_index.json` to mark this goal `done`.
