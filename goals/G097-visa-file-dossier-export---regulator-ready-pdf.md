---
id: G097
title: Visa file dossier export — regulator-ready PDF
workflow: W3
deps: ["G083"]
size: M
status: not_started
owner: claude_code
---

# G097 — Visa file dossier export — regulator-ready PDF

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G083
**Size:** M

## What

One-click export: full visa file audit trail as PDF dossier.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Dossier includes: file metadata, every event, every sign-off attempt, every edit, registration number, version hash
2. Hash-chain proof included
3. PDF formatted for regulator submission
4. Compliance + Super Admin can export
5. Export action logged to AuditLog

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G097` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G097: Visa file dossier export — regulator-ready PDF"`
Update `goals/_index.json` to mark this goal `done`.
