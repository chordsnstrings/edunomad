---
id: G036
title: SOP intro script + 10 qualification questions panel
workflow: W1
deps: ["G035"]
size: M
status: not_started
owner: claude_code
---

# G036 — SOP intro script + 10 qualification questions panel

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G035
**Size:** M

## What

Right rail of dialer: intro script + 10 qualification questions as checklist. Counsellor ticks as answered.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Intro script renders for first call only
2. 10 questions as checklist; tap to expand for full text
3. Answers captured as notes against student record
4. Searchable bar above (for finding specific objections during call)
5. Loads in <500ms

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G036` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G036: SOP intro script + 10 qualification questions panel"`
Update `goals/_index.json` to mark this goal `done`.
