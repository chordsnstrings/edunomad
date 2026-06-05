---
id: G165
title: Incident severity classification + runbook variants
workflow: W7
deps: ["G164"]
size: M
status: not_started
owner: claude_code
---

# G165 — Incident severity classification + runbook variants

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G164
**Size:** M

## What

Sev 1-4 classification. Each severity has a runbook variant.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Sev 1: data exposure / regulator complaint / outage
2. Sev 2: significant degradation / suspected breach without exposure
3. Sev 3: localised issue / partner failure
4. Sev 4: minor / monitoring
5. Per-severity escalation list + response SLA

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G165` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G165: Incident severity classification + runbook variants"`
Update `goals/_index.json` to mark this goal `done`.
