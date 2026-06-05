---
id: G164
title: Incident response — auto-create incident channel + load runbook
workflow: W7
deps: []
size: L
status: not_started
owner: claude_code
---

# G164 — Incident response — auto-create incident channel + load runbook

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** (none)
**Size:** L

## What

Super Admin (or Compliance) declares incident → channel created, runbook loaded, notifications dispatched.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Incident entity: severity (1-4), title, declared_by, runbook_id
2. Auto-create incident channel (Slack or in-app)
3. Runbook loaded from Super Admin SOP §6
4. Notifications per severity: CTO, EM, optional external counsel
5. Timeline of actions captured

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G164` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G164: Incident response — auto-create incident channel + load runbook"`
Update `goals/_index.json` to mark this goal `done`.
