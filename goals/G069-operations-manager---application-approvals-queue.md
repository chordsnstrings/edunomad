---
id: G069
title: Operations Manager — application approvals queue
workflow: W2
deps: ["G053"]
size: M
status: not_started
owner: claude_code
---

# G069 — Operations Manager — application approvals queue

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G053
**Size:** M

## What

/operations-manager/approvals. Lists applications needing manager sign-off before submission. Approve or return.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Queue with cases at 'ready for review' state
2. Manager reviews packet preview + QA results
3. Approve → application.packaged stays / submission allowed
4. Return → back to ops member with notes
5. RBAC: own_team

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G069` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G069: Operations Manager — application approvals queue"`
Update `goals/_index.json` to mark this goal `done`.
