---
id: G042
title: Automatic doc first-pass check — legibility + name OCR
workflow: W1
deps: ["G041"]
size: L
status: not_started
owner: claude_code
---

# G042 — Automatic doc first-pass check — legibility + name OCR

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G041
**Size:** L

## What

Server-side: OCR uploaded doc; check legibility (resolution, blur), extract name, compare with Student.full_name.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. OCR via library (Tesseract or chosen service)
2. Legibility heuristic: text confidence > 70%, not blurry
3. Name extracted from doc and Levenshtein-compared to Student.full_name
4. If legibility fail or name mismatch: flagged for human QA with reason
5. QA results saved to Document.qa_results jsonb
6. Even pass-through items queue for human QA

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G042` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G042: Automatic doc first-pass check — legibility + name OCR"`
Update `goals/_index.json` to mark this goal `done`.
