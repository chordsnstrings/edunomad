---
id: G055
title: SOP polish screen with Claude API integration
workflow: W2
deps: ["G052"]
size: L
status: not_started
owner: claude_code
---

# G055 — SOP polish screen with Claude API integration

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G052
**Size:** L

## What

Per application, polish SOP. Three paths: A (refine student draft), B (generate from profile + notes), C (plagiarism-check + refine student-provided).

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Path selector based on context
2. Path B: integrates Claude API (interface in place; key in env)
3. Live word count vs destination target
4. Plagiarism score from chosen service
5. Per-destination tone guide visible
6. Side-by-side draft vs current
7. Version-controlled save
8. Counsellor notes visible during polish

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G055` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G055: SOP polish screen with Claude API integration"`
Update `goals/_index.json` to mark this goal `done`.
