---
id: G003
title: PWA manifest and service worker scaffold
workflow: W0
deps: ["G001"]
size: S
status: not_started
owner: claude_code
---

# G003 — PWA manifest and service worker scaffold

**Workflow:** W0 (Foundations)
**Dependencies:** G001
**Size:** S

## What

Add manifest.json, service worker registration, install prompt. App installable to home screen on iOS and Android.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. manifest.json valid; icons in all required sizes
2. Service worker registers without error
3. Install prompt appears in supported browsers
4. Lighthouse PWA audit ≥ 70 (target 90 later)
5. App opens full-screen when installed

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G003` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G003: PWA manifest and service worker scaffold"`
Update `goals/_index.json` to mark this goal `done`.
