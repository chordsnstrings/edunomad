---
id: G031
title: Counsellor inbox — list view with tabs
workflow: W1
deps: ["G029", "G006"]
size: M
status: not_started
owner: claude_code
---

# G031 — Counsellor inbox — list view with tabs

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G029, G006
**Size:** M

## What

/counsellor/inbox. 3 tabs: New leads, Active, Need attention.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 3 tabs with live counts
2. Sort within each tab logical (assignment time / last activity / urgency)
3. Cards: name, source, lead_score, time-since
4. Tap card → lead detail
5. RBAC: counsellor sees only own_assigned

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G031` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G031: Counsellor inbox — list view with tabs"`
Update `goals/_index.json` to mark this goal `done`.
