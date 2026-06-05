---
id: G059
title: Tier 1 email submission gateway
workflow: W2
deps: ["G058"]
size: L
status: not_started
owner: claude_code
---

# G059 — Tier 1 email submission gateway

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G058
**Size:** L

## What

For Tier 1 unis: compose templated email with packet attached, send to admissions email. Embed [EDUNOMAD-APP-XXXX] reference_id in subject.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Email template per university (configurable)
2. Reference_id auto-generated and embedded in subject
3. Packet attached (signed URL or inline depending on size)
4. Send via chosen email provider (Postmark/SES/etc.)
5. Capture sent timestamp + recipient + reference_id as submission proof
6. application.submitted event emitted

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G059` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G059: Tier 1 email submission gateway"`
Update `goals/_index.json` to mark this goal `done`.
