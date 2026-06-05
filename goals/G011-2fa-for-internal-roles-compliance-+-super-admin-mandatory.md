---
id: G011
title: 2FA for internal roles (Compliance + Super Admin mandatory)
workflow: W0
deps: ["G008"]
size: M
status: not_started
owner: claude_code
---

# G011 — 2FA for internal roles (Compliance + Super Admin mandatory)

**Workflow:** W0 (Foundations)
**Dependencies:** G008
**Size:** M

## What

TOTP-based 2FA. Available for all internal; mandatory at first login for Compliance + Super Admin.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. TOTP enrolment screen renders QR for authenticator app
2. Verify code at enrolment
3. Subsequent logins prompt for 2FA code if enrolled
4. Compliance + Super Admin blocked from completing login until 2FA enrolled
5. Recovery codes generated at enrolment, shown once
6. 2FA disabling logs to AuditLog

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G011` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G011: 2FA for internal roles (Compliance + Super Admin mandatory)"`
Update `goals/_index.json` to mark this goal `done`.
