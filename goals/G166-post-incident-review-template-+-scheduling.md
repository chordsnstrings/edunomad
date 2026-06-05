---
id: G166
title: Post-incident review template + scheduling
workflow: W7
deps: ["G164"]
size: S
status: not_started
owner: claude_code
---

# G166 — Post-incident review template + scheduling

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G164
**Size:** S

## What

Post-incident review auto-scheduled (Sev 1-2). Template captures: timeline, impact, root cause, actions.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Auto-scheduled within 7 days of incident close
2. Template populated from incident timeline
3. Action items tracked as goals or tickets
4. Visible to Compliance + Super Admin + Education Manager

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G166` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G166: Post-incident review template + scheduling"`
Update `goals/_index.json` to mark this goal `done`.
