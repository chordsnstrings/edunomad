---
id: G015
title: Brand baseline — colours, typography, base components
workflow: W0
deps: ["G001"]
size: M
status: not_started
owner: claude_code
---

# G015 — Brand baseline — colours, typography, base components

**Workflow:** W0 (Foundations)
**Dependencies:** G001
**Size:** M

## What

Design tokens + base components: Button, Input, Card, Modal, Toast, EmptyState, SkeletonLoader, ErrorBoundary. Navy #0B1A2E, gold #C9A84C.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Design tokens for colours, spacing, typography, breakpoints
2. Mobile-first breakpoint at 380px
3. Button variants: primary/secondary/ghost; all states
4. Input: text/password/phone with inline validation
5. Card: 1px rule, no drop shadow
6. Toast: success/info/error with undo for reversible
7. EmptyState: illustration + heading + body + CTA
8. All components Arial / system sans; tap targets ≥ 44px

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G015` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G015: Brand baseline — colours, typography, base components"`
Update `goals/_index.json` to mark this goal `done`.
