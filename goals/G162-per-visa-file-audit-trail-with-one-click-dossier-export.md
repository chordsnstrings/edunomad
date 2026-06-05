---
id: G162
title: Per-visa-file audit trail with one-click dossier export
workflow: W7
deps: ["G097"]
size: S
status: not_started
owner: claude_code
---

# G162 — Per-visa-file audit trail with one-click dossier export

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G097
**Size:** S

## What

Per visa file detail: 'Export dossier' button generates regulator-ready PDF.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Button on visa file detail (Compliance + Super Admin only)
2. PDF includes: file metadata, full audit trail, sign-off proof, hash chain segment
3. Export action logged

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G162` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G162: Per-visa-file audit trail with one-click dossier export"`
Update `goals/_index.json` to mark this goal `done`.
