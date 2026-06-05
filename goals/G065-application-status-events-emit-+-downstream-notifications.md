---
id: G065
title: Application status events emit + downstream notifications
workflow: W2
deps: ["G064"]
size: S
status: not_started
owner: claude_code
---

# G065 — Application status events emit + downstream notifications

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G064
**Size:** S

## What

When ops classifies, all downstream events fire (notifications per channel policy).

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Each classification → correct event type
2. Visibility + channels per event catalog respected
3. Student/parent/counsellor receive notifications per policy
4. Activity feed updates within 1s

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G065` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G065: Application status events emit + downstream notifications"`
Update `goals/_index.json` to mark this goal `done`.
