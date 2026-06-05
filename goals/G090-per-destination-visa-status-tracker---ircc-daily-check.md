---
id: G090
title: Per-destination visa status tracker — IRCC daily check
workflow: W3
deps: ["G089"]
size: L
status: not_started
owner: claude_code
---

# G090 — Per-destination visa status tracker — IRCC daily check

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G089
**Size:** L

## What

Daily check of IRCC portal (or equivalent) for each submitted file. Status events emitted on change.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Scheduler runs daily per destination
2. IRCC: portal login + status scrape per file (or via official API if available)
3. UK: UKVI tracking
4. AU: ImmiAccount
5. MY: EMGS
6. Status changes → events (additional_docs_requested, decision_approved, decision_refused)

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G090` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G090: Per-destination visa status tracker — IRCC daily check"`
Update `goals/_index.json` to mark this goal `done`.
