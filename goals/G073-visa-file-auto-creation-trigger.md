---
id: G073
title: Visa file auto-creation trigger
workflow: W3
deps: ["G068"]
size: M
status: not_started
owner: claude_code
---

# G073 — Visa file auto-creation trigger

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G068
**Size:** M

## What

Detect: unconditional offer + accepted + tuition deposit paid + LOA/CAS/COE received → auto-create VisaFile.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Trigger fires when all 4 conditions true
2. VisaFile row created with destination_country from accepted Application
3. Checklist initialised from destination-rules.md per-country checklist
4. visa_file.prep_started event emitted
5. Operations queue picks up the new file

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G073` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G073: Visa file auto-creation trigger"`
Update `goals/_index.json` to mark this goal `done`.
