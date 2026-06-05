---
id: G089
title: Visa application submission via official channel
workflow: W3
deps: ["G087"]
size: M
status: not_started
owner: claude_code
---

# G089 — Visa application submission via official channel

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G087
**Size:** M

## What

After biometrics + sign-off, ops submits to destination's official channel. Captures submission proof.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Submission method per destination
2. Submission proof (receipt, screenshot, confirmation number) captured
3. visa.application_submitted event emitted
4. VisaFile.submitted_at + submission_proof populated

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G089` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G089: Visa application submission via official channel"`
Update `goals/_index.json` to mark this goal `done`.
