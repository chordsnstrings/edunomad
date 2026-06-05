---
id: G028
title: Eligibility result screen — tabs and cost summary
workflow: W1
deps: ["G027"]
size: M
status: not_started
owner: claude_code
---

# G028 — Eligibility result screen — tabs and cost summary

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G027
**Size:** M

## What

UI: 3 tabs (Reach/Match/Safe), summary line, total cost.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Summary: 'X programmes across Y countries'
2. 3 tabs with counts
3. Programme cards: university, name, tuition, English, intake
4. Tap card → programme detail
5. Total cost from cost-components.md
6. Empty state for no matches

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G028` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G028: Eligibility result screen — tabs and cost summary"`
Update `goals/_index.json` to mark this goal `done`.
