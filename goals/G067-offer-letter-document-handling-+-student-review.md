---
id: G067
title: Offer letter document handling + student review
workflow: W2
deps: ["G064"]
size: S
status: not_started
owner: claude_code
---

# G067 — Offer letter document handling + student review

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G064
**Size:** S

## What

Offer letter attached to application, visible to student + parent, downloadable.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Offer letter Document linked to Application
2. Visible on student/parent application detail
3. Download via signed URL
4. Status: Pending acceptance / Accepted / Declined

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G067` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G067: Offer letter document handling + student review"`
Update `goals/_index.json` to mark this goal `done`.
