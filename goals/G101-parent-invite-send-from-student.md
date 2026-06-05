---
id: G101
title: Parent invite send from student
workflow: W4
deps: ["G013"]
size: S
status: not_started
owner: claude_code
---

# G101 — Parent invite send from student

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G013
**Size:** S

## What

Student enters parent's WhatsApp number; system sends invite link via WhatsApp.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. UI: student enters phone (E.164 validated)
2. WhatsApp invite sent with link
3. ParentInvite row created with status sent
4. parent.invite_sent event

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G101` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G101: Parent invite send from student"`
Update `goals/_index.json` to mark this goal `done`.
