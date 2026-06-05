---
id: G113
title: Parent complaint filing flow
workflow: W4
deps: ["G103"]
size: S
status: not_started
owner: claude_code
---

# G113 — Parent complaint filing flow

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G103
**Size:** S

## What

Parent files complaint via dedicated form. Routes to Counsellor Manager → potentially escalates to Education Manager.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Complaint form: subject + description + severity + optional evidence
2. On submit: Complaint row + escalation event
3. Visible to CM; can escalate further to EM
4. Audit log entry
5. Parent sees status updates on their dashboard

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G113` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G113: Parent complaint filing flow"`
Update `goals/_index.json` to mark this goal `done`.
