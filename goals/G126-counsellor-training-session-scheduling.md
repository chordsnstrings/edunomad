---
id: G126
title: Counsellor training session scheduling
workflow: W5
deps: []
size: S
status: not_started
owner: claude_code
---

# G126 — Counsellor training session scheduling

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** (none)
**Size:** S

## What

CM schedules weekly training; counsellors RSVP.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Training session entity: title, datetime, link
2. Counsellor sees upcoming on their dashboard
3. RSVP captured
4. Recording linkable post-session

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G126` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G126: Counsellor training session scheduling"`
Update `goals/_index.json` to mark this goal `done`.
