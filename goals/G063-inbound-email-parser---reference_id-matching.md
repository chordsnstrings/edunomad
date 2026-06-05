---
id: G063
title: Inbound email parser — reference_id matching
workflow: W2
deps: ["G059"]
size: M
status: not_started
owner: claude_code
---

# G063 — Inbound email parser — reference_id matching

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G059
**Size:** M

## What

Scheduled or webhook-based: read inbound emails, match [EDUNOMAD-APP-XXXX] to applications, surface as 'new replies' inbox.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Inbound email source (IMAP poll or provider webhook)
2. Subject parsed for [EDUNOMAD-APP-XXXX] pattern
3. Match found → new entry in /operations/replies inbox
4. No match → manual triage queue
5. Attachments stored as Documents linked to application

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G063` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G063: Inbound email parser — reference_id matching"`
Update `goals/_index.json` to mark this goal `done`.
