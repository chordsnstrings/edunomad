---
id: G078
title: GIC certificate upload + name/amount validation
workflow: W3
deps: ["G075"]
size: S
status: not_started
owner: claude_code
---

# G078 — GIC certificate upload + name/amount validation

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G075
**Size:** S

## What

Upload GIC certificate. OCR extracts name + amount; validates against passport + threshold.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Upload GIC cert as PDF
2. OCR extracts name and amount
3. Validate name matches Student.full_name (Levenshtein < 2)
4. Validate amount >= CAD 22,895
5. Pass / flag-for-review based on validation

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G078` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G078: GIC certificate upload + name/amount validation"`
Update `goals/_index.json` to mark this goal `done`.
