---
id: G091
title: Visa decision handling — approved
workflow: W3
deps: ["G090"]
size: S
status: not_started
owner: claude_code
---

# G091 — Visa decision handling — approved

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G090
**Size:** S

## What

On approved: emit event, trigger Pre-Departure workflow setup, notify counsellor for celebratory call.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. visa.decision_approved event
2. VisaFile.decision_status = approved
3. Pre-Departure workflow state seeded for the student
4. Counsellor notified to schedule celebratory call

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G091` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G091: Visa decision handling — approved"`
Update `goals/_index.json` to mark this goal `done`.
