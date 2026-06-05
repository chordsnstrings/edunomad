---
id: G086
title: Compliance refusal-to-sign protocol
workflow: W3
deps: ["G083"]
size: M
status: not_started
owner: claude_code
---

# G086 — Compliance refusal-to-sign protocol

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G083
**Size:** M

## What

Refuse action: requires regulatory citation + reasoning. Auto-escalates to Education Manager.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Refusal form: regulatory citation (free text + dropdown of common citations), reasoning, evidence references
2. On refuse: file state → 'compliance_refused'
3. Education Manager notified
4. Audit log entry with full context
5. Refusal cannot be reversed; new visa file would be needed

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G086` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G086: Compliance refusal-to-sign protocol"`
Update `goals/_index.json` to mark this goal `done`.
