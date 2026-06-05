---
id: G096
title: Regulator notification flow — misrepresentation post-sign-off
workflow: W3
deps: ["G082"]
size: M
status: not_started
owner: claude_code
---

# G096 — Regulator notification flow — misrepresentation post-sign-off

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G082
**Size:** M

## What

If misrepresentation discovered after sign-off: structured notification flow to regulator.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. regulator_notification entity
2. Compliance captures facts + drafts notification per regulator template
3. Routes to external counsel for review (status field)
4. Approved → dispatched + audit log entry
5. Visible only to Compliance + Super Admin + Education Manager

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G096` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G096: Regulator notification flow — misrepresentation post-sign-off"`
Update `goals/_index.json` to mark this goal `done`.
