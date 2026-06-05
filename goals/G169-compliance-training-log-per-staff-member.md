---
id: G169
title: Compliance training log per staff member
workflow: W7
deps: []
size: S
status: not_started
owner: claude_code
---

# G169 — Compliance training log per staff member

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** (none)
**Size:** S

## What

Per Compliance / Counsellor / Ops staff: training records (date, topic, certifying body).

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Training entry: user, topic, date, certifying_body, expiry_date
2. Per-user view + team view
3. Expiring soon alerts
4. Required for regulator-evidence packets

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G169` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G169: Compliance training log per staff member"`
Update `goals/_index.json` to mark this goal `done`.
