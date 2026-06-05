---
id: G168
title: Data export — student PII compliance (DSAR/erasure)
workflow: W7
deps: ["G160"]
size: M
status: not_started
owner: claude_code
---

# G168 — Data export — student PII compliance (DSAR/erasure)

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G160
**Size:** M

## What

On DSAR request: export all PII for a student. On erasure: hard-delete or pseudonymise per policy.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. DSAR export: all Student-related data as zip
2. Erasure: pseudonymise where regulatory retention applies; hard-delete where not
3. Cannot erase Student while visa file in flight
4. Audit log entry per action

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G168` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G168: Data export — student PII compliance (DSAR/erasure)"`
Update `goals/_index.json` to mark this goal `done`.
