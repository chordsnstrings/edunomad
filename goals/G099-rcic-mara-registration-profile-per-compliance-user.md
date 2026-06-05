---
id: G099
title: RCIC/MARA registration profile per Compliance user
workflow: W3
deps: ["G083"]
size: S
status: not_started
owner: claude_code
---

# G099 — RCIC/MARA registration profile per Compliance user

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G083
**Size:** S

## What

Compliance user has registration_number + body (RCIC / CICC / MARA / OISC) on profile.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Compliance user profile includes regulatory body + registration number
2. Number stamped on sign-off
3. Validation: number format per body
4. Visible on signed files

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G099` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G099: RCIC/MARA registration profile per Compliance user"`
Update `goals/_index.json` to mark this goal `done`.
