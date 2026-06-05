---
id: G102
title: Parent invite accept flow — PIN + OTP
workflow: W4
deps: ["G101"]
size: M
status: not_started
owner: claude_code
---

# G102 — Parent invite accept flow — PIN + OTP

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G101
**Size:** M

## What

Parent taps invite link, sets PIN, verifies via OTP, lands on student status page.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Invite link opens parent setup
2. Parent sets 4-digit PIN
3. Phone OTP verifies identity
4. On success: User row (parent) created, ParentInvite.status = accepted
5. parent.invite_accepted event
6. Lands on parent dashboard for that student

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G102` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G102: Parent invite accept flow — PIN + OTP"`
Update `goals/_index.json` to mark this goal `done`.
