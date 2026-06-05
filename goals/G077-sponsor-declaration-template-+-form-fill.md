---
id: G077
title: Sponsor declaration template + form-fill
workflow: W3
deps: ["G075"]
size: S
status: not_started
owner: claude_code
---

# G077 — Sponsor declaration template + form-fill

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G075
**Size:** S

## What

Generate sponsor declaration from sponsor data; download as PDF.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Template loaded from /admin/templates
2. Sponsor info pre-filled from Student.funding_source + sponsor entity
3. Downloadable as PDF
4. Track signed status (uploaded signed version)

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G077` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G077: Sponsor declaration template + form-fill"`
Update `goals/_index.json` to mark this goal `done`.
