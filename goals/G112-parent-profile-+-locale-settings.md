---
id: G112
title: Parent profile + locale settings
workflow: W4
deps: ["G102"]
size: S
status: not_started
owner: claude_code
---

# G112 — Parent profile + locale settings

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G102
**Size:** S

## What

Parent settings: language, large-font, push/WhatsApp preferences, sign-out.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Settings screen accessible from dashboard
2. Language picker
3. Large-font toggle
4. Notification preferences per channel
5. Sign-out clears session

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G112` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G112: Parent profile + locale settings"`
Update `goals/_index.json` to mark this goal `done`.
