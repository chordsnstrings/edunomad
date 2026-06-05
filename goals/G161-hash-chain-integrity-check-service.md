---
id: G161
title: Hash-chain integrity check service
workflow: W7
deps: ["G005", "G007"]
size: M
status: not_started
owner: claude_code
---

# G161 — Hash-chain integrity check service

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G005, G007
**Size:** M

## What

Scheduled integrity verification. Detects tampering. Alerts Compliance + Super Admin on mismatch.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Daily run verifies full event chain + audit chain
2. Mismatch → alert via push + email to Compliance + Super Admin
3. Verification result stored
4. Manual trigger available from UI

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G161` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G161: Hash-chain integrity check service"`
Update `goals/_index.json` to mark this goal `done`.
