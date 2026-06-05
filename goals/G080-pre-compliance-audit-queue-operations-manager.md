---
id: G080
title: Pre-Compliance audit queue (Operations Manager)
workflow: W3
deps: ["G075"]
size: M
status: not_started
owner: claude_code
---

# G080 — Pre-Compliance audit queue (Operations Manager)

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G075
**Size:** M

## What

When VisaFile reaches 100% complete, moves to OpsManager queue. Manager reviews and forwards to Compliance or returns to ops.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. VisaFile state transitions: in_prep → ready_for_pre_audit when 100%
2. OpsManager queue lists ready files
3. Manager view: full file checklist + completeness items
4. Two actions: Forward to Compliance / Return to ops with gaps
5. Forward → visa_file.ready_for_signoff event

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G080` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G080: Pre-Compliance audit queue (Operations Manager)"`
Update `goals/_index.json` to mark this goal `done`.
