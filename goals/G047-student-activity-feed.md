---
id: G047
title: Student activity feed
workflow: W1
deps: ["G018"]
size: S
status: not_started
owner: claude_code
---

# G047 — Student activity feed

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G018
**Size:** S

## What

/student/activity. Reverse-chronological feed of student-visible events. Read/unread state.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Feed from /api/feed
2. Renders event templates in student's language
3. Unread events have visual marker
4. Tap event → mark read (EventRead row)
5. Pull-to-refresh on mobile
6. Pagination/load more

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G047` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G047: Student activity feed"`
Update `goals/_index.json` to mark this goal `done`.
