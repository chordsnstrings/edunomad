---
id: G039
title: Per-student personalised document checklist generator
workflow: W1
deps: ["G026"]
size: M
status: not_started
owner: claude_code
---

# G039 — Per-student personalised document checklist generator

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G026
**Size:** M

## What

Given a Student's destinations + profile, generate the document checklist. Push to Student dashboard.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Generator reads docs/05-reference/document-checklist.md
2. Checklist filtered by destination + degree level + age (for police cert)
3. Includes per-doc guidance copy (4 languages)
4. document_checklist.generated event emitted
5. Visible in Student doc vault

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G039` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G039: Per-student personalised document checklist generator"`
Update `goals/_index.json` to mark this goal `done`.
