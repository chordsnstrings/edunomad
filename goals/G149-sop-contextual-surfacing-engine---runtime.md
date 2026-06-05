---
id: G149
title: SOP contextual surfacing engine — runtime
workflow: W6
deps: ["G144"]
size: L
status: not_started
owner: claude_code
---

# G149 — SOP contextual surfacing engine — runtime

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G144
**Size:** L

## What

Runtime engine evaluates trigger rules per page load. Returns matching blocks for the current context.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Engine API: getRelevantBlocks(user, context) → blocks[]
2. Context: current screen, current entity state, user role
3. Trigger rules evaluated; matching blocks returned
4. Cached per context to keep latency ≤ 500ms
5. Re-evaluates on relevant data changes

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G149` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G149: SOP contextual surfacing engine — runtime"`
Update `goals/_index.json` to mark this goal `done`.
