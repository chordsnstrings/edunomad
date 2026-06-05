---
id: G124
title: CM per-counsellor scorecard
workflow: W5
deps: ["G118"]
size: S
status: not_started
owner: claude_code
---

# G124 — CM per-counsellor scorecard

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G118
**Size:** S

## What

Per-counsellor: pipeline depth, conversion, QA scores, NPS, SLA, escalations.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Scorecard accessible from team list
2. Monthly trends per metric
3. Comparison to team median
4. Export to PDF

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G124` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G124: CM per-counsellor scorecard"`
Update `goals/_index.json` to mark this goal `done`.
