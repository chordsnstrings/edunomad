---
id: G076
title: Photo cropper for visa photos with per-destination spec
workflow: W3
deps: ["G075"]
size: M
status: not_started
owner: claude_code
---

# G076 — Photo cropper for visa photos with per-destination spec

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G075
**Size:** M

## What

Photo upload with cropper enforcing per-destination dimensions (e.g. IRCC 35×45mm, UK 35×45mm).

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Cropper component with destination-specific aspect ratio + size
2. Reject if uploaded image too small for required print size
3. Background colour check (white/off-white)
4. Preview before save

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G076` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G076: Photo cropper for visa photos with per-destination spec"`
Update `goals/_index.json` to mark this goal `done`.
