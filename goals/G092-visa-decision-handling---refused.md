---
id: G092
title: Visa decision handling — refused
workflow: W3
deps: ["G090"]
size: M
status: not_started
owner: claude_code
---

# G092 — Visa decision handling — refused

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G090
**Size:** M

## What

On refused: capture refusal reasons, surface to counsellor + Compliance, suggest reapplication or alternative.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. visa.decision_refused event with reasons
2. Counsellor + Compliance notified
3. Refusal reasons displayed prominently on file
4. System suggests next options: reapplication / alternative destination / pathway change
5. Compliance review logs systemic patterns

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G092` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G092: Visa decision handling — refused"`
Update `goals/_index.json` to mark this goal `done`.
