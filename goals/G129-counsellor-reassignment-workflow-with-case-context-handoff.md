---
id: G129
title: Counsellor reassignment workflow with case context handoff
workflow: W5
deps: ["G116"]
size: S
status: not_started
owner: claude_code
---

# G129 — Counsellor reassignment workflow with case context handoff

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G116
**Size:** S

## What

When reassigning, full case context (notes, history, doc status) transfers automatically.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Reassignment action transfers Student.assigned_counsellor_id
2. Notification to both counsellors
3. Reason captured
4. New counsellor sees complete history

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G129` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G129: Counsellor reassignment workflow with case context handoff"`
Update `goals/_index.json` to mark this goal `done`.
