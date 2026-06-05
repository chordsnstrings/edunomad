---
id: G085
title: Compliance return-with-changes flow
workflow: W3
deps: ["G083"]
size: S
status: not_started
owner: claude_code
---

# G085 — Compliance return-with-changes flow

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G083
**Size:** S

## What

Return action: capture annotations + summary → back to ops member.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Annotations stored against doc/file
2. Return summary required
3. visa_file.returned event emitted
4. File state → 'in_prep' (ops can edit again)

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G085` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G085: Compliance return-with-changes flow"`
Update `goals/_index.json` to mark this goal `done`.
