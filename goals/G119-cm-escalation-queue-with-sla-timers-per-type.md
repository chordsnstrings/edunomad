---
id: G119
title: CM escalation queue with SLA timers per type
workflow: W5
deps: ["G110"]
size: M
status: not_started
owner: claude_code
---

# G119 — CM escalation queue with SLA timers per type

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G110
**Size:** M

## What

Escalations sorted by type: hostile parent / refund / fraud / compliance. SLA timer per type.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 4 queue types
2. Hostile parent: 30-min SLA timer visible
3. Refund / fraud / compliance: 4-hour SLA
4. Triage actions: take over / coach / escalate further
5. Take-over loads full case context
6. SLA breaches highlighted

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G119` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G119: CM escalation queue with SLA timers per type"`
Update `goals/_index.json` to mark this goal `done`.
