---
id: G093
title: Visa additional documents request handling
workflow: W3
deps: ["G090"]
size: S
status: not_started
owner: claude_code
---

# G093 — Visa additional documents request handling

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G090
**Size:** S

## What

When IRCC requests additional docs: surface in ops queue with priority flag.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. visa.additional_docs_requested event
2. File flagged in ops queue with high priority
3. Specific docs requested visible
4. Document collection sub-flow within the visa file

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G093` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G093: Visa additional documents request handling"`
Update `goals/_index.json` to mark this goal `done`.
