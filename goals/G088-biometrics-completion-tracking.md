---
id: G088
title: Biometrics completion tracking
workflow: W3
deps: ["G087"]
size: S
status: not_started
owner: claude_code
---

# G088 — Biometrics completion tracking

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G087
**Size:** S

## What

After student attends biometrics, ops confirms. Event emitted.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Ops marks biometrics completed for the file
2. visa.biometrics_completed event
3. File state notes biometrics done

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G088` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G088: Biometrics completion tracking"`
Update `goals/_index.json` to mark this goal `done`.
