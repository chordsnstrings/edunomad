---
id: G122
title: Refund approval chain — multi-stage
workflow: W5
deps: []
size: M
status: not_started
owner: claude_code
---

# G122 — Refund approval chain — multi-stage

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** (none)
**Size:** M

## What

Refund > counsellor limit → CM. > CM limit → EM. Approval chain visible.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Refund request creation by counsellor (with reason)
2. Routing based on amount vs limits
3. Approval action: Approve / Decline / Request more info
4. Chain visible on refund detail
5. On approve: refund.initiated event

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G122` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G122: Refund approval chain — multi-stage"`
Update `goals/_index.json` to mark this goal `done`.
