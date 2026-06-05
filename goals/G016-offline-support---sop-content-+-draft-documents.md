---
id: G016
title: Offline support — SOP content + draft documents
workflow: W0
deps: ["G003", "G015"]
size: M
status: not_started
owner: claude_code
---

# G016 — Offline support — SOP content + draft documents

**Workflow:** W0 (Foundations)
**Dependencies:** G003, G015
**Size:** M

## What

Service worker caches SOP content + draft forms. Reads work offline; writes queue for sync.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. SOP content readable offline after first load
2. Profile builder works offline; saves queue for sync
3. Reconnection triggers queued sync; visible 'synced' confirmation
4. Conflict resolution: last-write-wins with audit note
5. Lighthouse PWA audit ≥ 90

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G016` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G016: Offline support — SOP content + draft documents"`
Update `goals/_index.json` to mark this goal `done`.
