---
id: G051
title: Operations work queue — locked shortlists arrive
workflow: W2
deps: ["G045", "G006"]
size: M
status: not_started
owner: claude_code
---

# G051 — Operations work queue — locked shortlists arrive

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G045, G006
**Size:** M

## What

/operations/queue. List of locked shortlists assigned to ops member. Sorted by intake deadline + uni SLA.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Queue updates within 1s of shortlist.locked
2. Sort: intake deadline ascending, then uni SLA
3. Per-row: student name, destination, intake, programmes count, oldest deadline
4. Capacity indicator at top
5. RBAC: own_assigned

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G051` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G051: Operations work queue — locked shortlists arrive"`
Update `goals/_index.json` to mark this goal `done`.
