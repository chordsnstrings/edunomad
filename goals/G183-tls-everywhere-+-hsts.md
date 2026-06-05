---
id: G183
title: TLS everywhere + HSTS
workflow: CC
deps: ["G180"]
size: S
status: not_started
owner: claude_code
---

# G183 — TLS everywhere + HSTS

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G180
**Size:** S

## What

All traffic TLS. HSTS header. Certificate auto-renewal.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Production serves only HTTPS
2. HSTS header set with reasonable max-age
3. Cert auto-renewal (Let's Encrypt or provider-managed)

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G183` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G183: TLS everywhere + HSTS"`
Update `goals/_index.json` to mark this goal `done`.
