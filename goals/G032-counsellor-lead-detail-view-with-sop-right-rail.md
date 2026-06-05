---
id: G032
title: Counsellor lead detail view with SOP right rail
workflow: W1
deps: ["G031"]
size: L
status: not_started
owner: claude_code
---

# G032 — Counsellor lead detail view with SOP right rail

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G031
**Size:** L

## What

Lead detail: left student summary + history + notes; right rail dynamic SOP snippets.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Left: profile, lead_score breakdown, source, history feed, notes editor
2. Right rail shows context-matching SOP snippets (qualification rubric, no-IELTS guidance, etc.)
3. Snippets latency ≤ 500ms
4. Notes save on blur
5. CTAs: WhatsApp, Book call

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G032` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G032: Counsellor lead detail view with SOP right rail"`
Update `goals/_index.json` to mark this goal `done`.
