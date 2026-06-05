---
id: G110
title: Parent 'Talk to a manager' escalation
workflow: W4
deps: ["G103"]
size: M
status: not_started
owner: claude_code
---

# G110 — Parent 'Talk to a manager' escalation

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G103
**Size:** M

## What

Parent taps Talk to a manager → message routed to Counsellor Manager with case context.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Button visible from every parent screen
2. Tap opens form: brief description + optional severity
3. Routes to Counsellor Manager
4. CM sees full student context loaded
5. SLA timer: 4 working hours
6. Manager response visible to parent in chat

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G110` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G110: Parent 'Talk to a manager' escalation"`
Update `goals/_index.json` to mark this goal `done`.
