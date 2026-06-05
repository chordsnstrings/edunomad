---
id: G142
title: SOP block type — kpi (live target display)
workflow: W6
deps: ["G137"]
size: S
status: not_started
owner: claude_code
---

# G142 — SOP block type — kpi (live target display)

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137
**Size:** S

## What

KPI block: metric + target + direction. Live value rendered on dashboards.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Editor: metric picker (from registered metrics), target, direction
2. Live value from metrics service
3. Renders on role dashboards

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G142` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G142: SOP block type — kpi (live target display)"`
Update `goals/_index.json` to mark this goal `done`.
