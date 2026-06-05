---
id: G128
title: Counsellor performance bands + automated tier compute
workflow: W5
deps: ["G118"]
size: M
status: not_started
owner: claude_code
---

# G128 — Counsellor performance bands + automated tier compute

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G118
**Size:** M

## What

Counsellors auto-classified into tiers (top 25 / mid 50 / bottom 25) based on rolling metrics.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Tier computed weekly from rolling 30-day metrics
2. Tier visible on counsellor profile
3. Tier influences VIP-lead routing

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G128` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G128: Counsellor performance bands + automated tier compute"`
Update `goals/_index.json` to mark this goal `done`.
