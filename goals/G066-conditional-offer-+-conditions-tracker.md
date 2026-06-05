---
id: G066
title: Conditional offer + conditions tracker
workflow: W2
deps: ["G064"]
size: M
status: not_started
owner: claude_code
---

# G066 — Conditional offer + conditions tracker

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G064
**Size:** M

## What

Conditional offers: capture conditions, track satisfaction, emit conditions.met when all complete.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Conditional offer view shows list of conditions (free-text or structured)
2. Each condition has status: pending/satisfied/cannot_satisfy
3. Ops marks as satisfied with evidence (uploaded doc or note)
4. When all satisfied: conditions.met event automatically

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G066` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G066: Conditional offer + conditions tracker"`
Update `goals/_index.json` to mark this goal `done`.
