---
id: G106
title: Parent daily WhatsApp digest at 18:00 local
workflow: W4
deps: ["G013"]
size: M
status: not_started
owner: claude_code
---

# G106 — Parent daily WhatsApp digest at 18:00 local

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G013
**Size:** M

## What

If any events for student today, send digest WhatsApp at 18:00 in parent's locale.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Scheduler runs hourly; sends to parents where local time is 18:00
2. Digest summarises today's events in 1-2 lines
3. Uses parent_daily_digest template
4. Only sends if there were events today
5. Audit log entry per send

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G106` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G106: Parent daily WhatsApp digest at 18:00 local"`
Update `goals/_index.json` to mark this goal `done`.
