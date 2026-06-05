---
id: G115
title: CM dashboard — yesterday's standup screen
workflow: W5
deps: ["G050"]
size: M
status: not_started
owner: claude_code
---

# G115 — CM dashboard — yesterday's standup screen

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G050
**Size:** M

## What

/counsellor-manager. Top of screen shows yesterday's outputs per counsellor + leads in/out + conversion + SLA breaches.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Yesterday's outputs (calls, applications, offers) per counsellor
2. Leads in / out yesterday
3. Conversion rate trend (last 7 days)
4. SLA breach list (>24h untouched)
5. Hot leads needing reassignment
6. Counsellors at >130% load flagged

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G115` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G115: CM dashboard — yesterday's standup screen"`
Update `goals/_index.json` to mark this goal `done`.
