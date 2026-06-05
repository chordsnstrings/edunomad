---
id: G082
title: Misrepresentation flag detector — surface to Compliance
workflow: W3
deps: ["G081"]
size: M
status: not_started
owner: claude_code
---

# G082 — Misrepresentation flag detector — surface to Compliance

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G081
**Size:** M

## What

Combines cross-doc inconsistencies + counsellor/ops flags into a Compliance review queue.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. misrepresentation_flag entity
2. Auto-created from inconsistency checker
3. Manual flagging by counsellor/ops
4. Compliance review queue shows all flags
5. Compliance can mark resolved with note + evidence

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G082` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G082: Misrepresentation flag detector — surface to Compliance"`
Update `goals/_index.json` to mark this goal `done`.
