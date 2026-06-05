---
id: G130
title: End-of-day team thread post
workflow: W5
deps: ["G115"]
size: S
status: not_started
owner: claude_code
---

# G130 — End-of-day team thread post

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G115
**Size:** S

## What

CM posts to team thread at 17:30 with tomorrow's priorities + win/learning.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Team thread entity
2. Post composer with template
3. Visible to all counsellors on team
4. Notification per post

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G130` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G130: End-of-day team thread post"`
Update `goals/_index.json` to mark this goal `done`.
