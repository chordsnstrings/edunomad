---
id: G009
title: Session management + idle timeout
workflow: W0
deps: ["G008"]
size: S
status: not_started
owner: claude_code
---

# G009 — Session management + idle timeout

**Workflow:** W0 (Foundations)
**Dependencies:** G008
**Size:** S

## What

12h expiry. Internal roles: 30 min idle. Refresh on activity.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Session validates against server-side store
2. Sessions expire after 12h of issuance
3. Internal-role sessions also expire after 30 min idle
4. Activity refreshes idle clock
5. Expired session returns 401; UI redirects to sign-in
6. Logout invalidates session server-side

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G009` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G009: Session management + idle timeout"`
Update `goals/_index.json` to mark this goal `done`.
