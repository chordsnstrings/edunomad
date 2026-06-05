---
id: G160
title: Audit log export with hash-chain integrity proof
workflow: W7
deps: ["G159"]
size: M
status: not_started
owner: claude_code
---

# G160 — Audit log export with hash-chain integrity proof

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G159
**Size:** M

## What

Export selected entries with attached integrity proof.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Export action wraps entries with chain proof
2. Proof includes: start hash, end hash, chain length, sha256 of bulk export
3. Importer/verifier can validate against any subset
4. Exports themselves audit-logged

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G160` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G160: Audit log export with hash-chain integrity proof"`
Update `goals/_index.json` to mark this goal `done`.
