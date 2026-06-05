---
id: G005
title: Event table + emit helper + chain hash
workflow: W0
deps: ["G002"]
size: L
status: not_started
owner: claude_code
---

# G005 — Event table + emit helper + chain hash

**Workflow:** W0 (Foundations)
**Dependencies:** G002
**Size:** L

## What

Event entity per spec. emit(event) helper writes events with computed chain_hash. EventRead table for mutable per-user read state.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Event schema matches docs/01-data-model.md
2. emit() helper computes chain_hash = sha256(json(event) || prev_chain_hash)
3. First event in DB has chain_hash starting from genesis seed
4. Tampering test: modify event row, integrity check detects mismatch
5. Events insert-only — UPDATE and DELETE blocked at ORM or DB layer
6. EventRead table allows per-user read marking

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G005` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G005: Event table + emit helper + chain hash"`
Update `goals/_index.json` to mark this goal `done`.
