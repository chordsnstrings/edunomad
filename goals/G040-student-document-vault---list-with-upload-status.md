---
id: G040
title: Student document vault — list with upload status
workflow: W1
deps: ["G039", "G014"]
size: M
status: not_started
owner: claude_code
---

# G040 — Student document vault — list with upload status

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G039, G014
**Size:** M

## What

/student/documents. List of required documents with status badges. Tap to upload.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Shows all required docs grouped by stage
2. Status badges: needed / uploaded / under_review / approved / rework
3. Tap doc → upload screen
4. Guidance copy per doc visible
5. Empty state pre-checklist generation

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G040` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G040: Student document vault — list with upload status"`
Update `goals/_index.json` to mark this goal `done`.
