---
id: G131
title: Counsellor-side: my-stats screen
workflow: W5
deps: ["G124"]
size: S
status: not_started
owner: claude_code
---

# G131 — Counsellor-side: my-stats screen

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G124
**Size:** S

## What

Each counsellor sees their own scorecard.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Same data as CM scorecard but scoped to own
2. Personal goals tracking
3. Comparison to team median (anonymised)

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G131` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G131: Counsellor-side: my-stats screen"`
Update `goals/_index.json` to mark this goal `done`.
