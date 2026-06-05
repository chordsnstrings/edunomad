---
id: G105
title: Parent push notifications + WhatsApp on milestones
workflow: W4
deps: ["G012", "G013"]
size: M
status: not_started
owner: claude_code
---

# G105 — Parent push notifications + WhatsApp on milestones

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G012, G013
**Size:** M

## What

Parent receives push + WhatsApp on events where parent is in visibility AND channel.push/whatsapp = true.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Channel routing per event respects parent visibility
2. Templates rendered in parent's language
3. Both push and WhatsApp dispatched per event policy
4. Test critical events: application.submitted, offer.unconditional_received, visa.decision_approved

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G105` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G105: Parent push notifications + WhatsApp on milestones"`
Update `goals/_index.json` to mark this goal `done`.
