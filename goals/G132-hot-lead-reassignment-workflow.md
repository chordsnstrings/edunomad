---
id: G132
title: Hot-lead reassignment workflow
workflow: W5
deps: ["G129"]
size: S
status: not_started
owner: claude_code
---

# G132 — Hot-lead reassignment workflow

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G129
**Size:** S

## What

Hot leads (high score, urgent intake) get fast-tracked reassignment if original counsellor over-loaded.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Hot-lead criteria configurable
2. Auto-flag in CM queue
3. One-click reassign to top-quartile counsellor
4. Notifications to all parties

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G132` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G132: Hot-lead reassignment workflow"`
Update `goals/_index.json` to mark this goal `done`.
