---
id: G084
title: Compliance sign-off action — re-auth + stamping
workflow: W3
deps: ["G083"]
size: M
status: not_started
owner: claude_code
---

# G084 — Compliance sign-off action — re-auth + stamping

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G083
**Size:** M

## What

Sign action requires 2FA re-auth. Stamps RCIC/MARA registration number + version hash. File becomes immutable.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Sign button triggers 2FA re-auth challenge
2. On success: visa_file.signed_off event with registration_number + version_hash
3. VisaFile.signed_off_by + signed_off_at populated
4. File state → 'signed' — no further edits allowed
5. Audit log entry with full context

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G084` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G084: Compliance sign-off action — re-auth + stamping"`
Update `goals/_index.json` to mark this goal `done`.
