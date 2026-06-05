---
id: G037
title: SOP objections panel — keyword search + insert
workflow: W1
deps: ["G035"]
size: M
status: not_started
owner: claude_code
---

# G037 — SOP objections panel — keyword search + insert

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G035
**Size:** M

## What

Objections library searchable in dialer panel. 15 objections with responses. Counsellor finds and reads.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Search bar with debounced keyword match
2. All 15 objections from docs/05-reference/counsellor-scripts.md indexed
3. Each objection: keyword tags + response text
4. Tap to expand response
5. Optional 'Copy as note' to attach response context

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G037` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G037: SOP objections panel — keyword search + insert"`
Update `goals/_index.json` to mark this goal `done`.
