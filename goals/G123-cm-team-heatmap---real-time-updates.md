---
id: G123
title: CM team heatmap — real-time updates
workflow: W5
deps: ["G115"]
size: S
status: not_started
owner: claude_code
---

# G123 — CM team heatmap — real-time updates

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G115
**Size:** S

## What

Heatmap visualisation of team state, updating live.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Grid: counsellor × metric (pipeline depth, conversion, SLA, NPS)
2. Colour-coded cells
3. Live updates within 5s
4. Click cell for detail

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G123` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G123: CM team heatmap — real-time updates"`
Update `goals/_index.json` to mark this goal `done`.
