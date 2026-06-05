---
id: G008
title: Phone OTP auth — send + verify
workflow: W0
deps: ["G004"]
size: M
status: not_started
owner: claude_code
---

# G008 — Phone OTP auth — send + verify

**Workflow:** W0 (Foundations)
**Dependencies:** G004
**Size:** M

## What

OTP send/verify. Phone E.164. 5-min expiry. 3-attempt lockout. Rate limit per number.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. POST /auth/otp/send accepts phone, returns success/rate-limited
2. POST /auth/otp/verify accepts phone+code, returns session token
3. OTP expires after 5 min; 3 wrong attempts → 15 min lockout
4. Rate limit: 3 sends per number per hour
5. OTP delivered via SMS (Twilio or chosen; mocked in dev)
6. Sessions stored server-side with 12h expiry

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G008` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G008: Phone OTP auth — send + verify"`
Update `goals/_index.json` to mark this goal `done`.
