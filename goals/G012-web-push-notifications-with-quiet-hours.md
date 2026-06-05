---
id: G012
title: Web Push notifications with quiet hours
workflow: W0
deps: ["G003", "G005"]
size: M
status: not_started
owner: claude_code
---

# G012 — Web Push notifications with quiet hours

**Workflow:** W0 (Foundations)
**Dependencies:** G003, G005
**Size:** M

## What

Web Push API. Per-user push subscription. Quiet hours default 22:00–08:00 local. Channel routing reads from event catalog.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. User can grant/revoke push permission
2. Subscription stored against user
3. Push delivered for events where channels.push=true
4. Quiet hours respected per user's locale
5. Notification copy from event templates (i18n)
6. Failed delivery falls back to WhatsApp (when configured) or in-app only

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G012` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G012: Web Push notifications with quiet hours"`
Update `goals/_index.json` to mark this goal `done`.
