---
id: G087
title: VFS appointment booking link integration
workflow: W3
deps: ["G084"]
size: S
status: not_started
owner: claude_code
---

# G087 — VFS appointment booking link integration

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G084
**Size:** S

## What

After sign-off, ops gets a link to destination's VFS portal. Student receives confirmation when appointment booked.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Link generator per destination
2. Ops marks 'appointment booked' with date/time/location
3. visa.appointment_booked event with student notification (WhatsApp + email)

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G087` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G087: VFS appointment booking link integration"`
Update `goals/_index.json` to mark this goal `done`.
