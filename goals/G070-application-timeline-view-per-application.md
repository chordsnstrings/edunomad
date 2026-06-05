---
id: G070
title: Application timeline view (per application)
workflow: W2
deps: ["G046"]
size: S
status: not_started
owner: claude_code
---

# G070 — Application timeline view (per application)

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G046
**Size:** S

## What

Per-application timeline: all events for that application in order. Shown on application detail.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Filtered feed by application_id
2. Renders all events relevant to that application
3. Newest first; show full history
4. Visible to all roles per visibility rules

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G070` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G070: Application timeline view (per application)"`
Update `goals/_index.json` to mark this goal `done`.
