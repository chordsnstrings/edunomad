---
id: G060
title: Tier 2 portal credential vault — encrypted store + open-and-submit flow
workflow: W2
deps: ["G014"]
size: M
status: not_started
owner: claude_code
---

# G060 — Tier 2 portal credential vault — encrypted store + open-and-submit flow

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G014
**Size:** M

## What

For Tier 2 unis: vaulted credentials. Ops member opens portal, submits manually, captures screenshot proof.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Credentials encrypted at rest (use kms or chosen approach)
2. Decrypted only at submission time, displayed briefly
3. Screenshot upload as submission proof
4. Audit log entry for every credential decrypt
5. application.submitted event

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G060` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G060: Tier 2 portal credential vault — encrypted store + open-and-submit flow"`
Update `goals/_index.json` to mark this goal `done`.
