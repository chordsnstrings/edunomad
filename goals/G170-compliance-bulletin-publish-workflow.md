---
id: G170
title: Compliance bulletin publish workflow
workflow: W7
deps: ["G095"]
size: S
status: not_started
owner: claude_code
---

# G170 — Compliance bulletin publish workflow

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G095
**Size:** S

## What

Bulletin publish → updates destination_rules, cost_components, document_checklist, form_repository.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Bulletin entity → mapped to which dataset it updates
2. Publish action requires Compliance authentication
3. Affected open visa files get banners (G079)
4. Audit log per publish

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G170` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G170: Compliance bulletin publish workflow"`
Update `goals/_index.json` to mark this goal `done`.
