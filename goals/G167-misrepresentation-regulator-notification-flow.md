---
id: G167
title: Misrepresentation regulator notification flow
workflow: W7
deps: ["G096"]
size: M
status: not_started
owner: claude_code
---

# G167 — Misrepresentation regulator notification flow

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G096
**Size:** M

## What

End-to-end: discover post-sign-off misrep → draft notification → counsel review → dispatch.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Discovery: from misrepresentation_flag
2. Draft notification using regulator template
3. Routes to external counsel (status: awaiting_counsel)
4. Counsel approves/edits → dispatch via official channel
5. All steps audit-logged

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G167` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G167: Misrepresentation regulator notification flow"`
Update `goals/_index.json` to mark this goal `done`.
