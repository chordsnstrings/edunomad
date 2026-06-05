---
id: G121
title: CM PIP template trigger + weekly checkpoints
workflow: W5
deps: ["G118"]
size: M
status: not_started
owner: claude_code
---

# G121 — CM PIP template trigger + weekly checkpoints

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G118
**Size:** M

## What

When counsellor's rolling performance < bottom 25%: PIP can be triggered. Weekly checkpoint reminders.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Performance tier visible per counsellor
2. Trigger PIP button on counsellor profile
3. PIP form: areas + metrics + 4-week plan + checkpoints
4. Weekly checkpoint reminders to CM
5. PIP status visible on counsellor profile

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G121` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G121: CM PIP template trigger + weekly checkpoints"`
Update `goals/_index.json` to mark this goal `done`.
