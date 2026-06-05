---
id: G071
title: University SLA tracker
workflow: W2
deps: ["G059"]
size: M
status: not_started
owner: claude_code
---

# G071 — University SLA tracker

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G059
**Size:** M

## What

Per university, track expected response time. Flag overdue applications.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. University.payment_terms_days + a separate response_sla_days field
2. Applications past SLA flagged in ops queue
3. Notification to ops_manager when SLA breached
4. Dashboard view of all overdue applications

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G071` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G071: University SLA tracker"`
Update `goals/_index.json` to mark this goal `done`.
