---
id: G038
title: Compliance keyword guards — real-time on counsellor messages
workflow: W1
deps: ["G013", "G033"]
size: M
status: not_started
owner: claude_code
---

# G038 — Compliance keyword guards — real-time on counsellor messages

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G013, G033
**Size:** M

## What

When counsellor composes WhatsApp/chat: keyword detection fires for visa guarantee / PR promise / off-platform payment. Modal blocks send with rephrase prompt.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Keyword lists from docs/05-reference/counsellor-scripts.md
2. Detection runs on send-button click (not keystroke; reduces noise)
3. Modal: explanation + rephrase suggestion + Cancel / Continue anyway
4. Continue logs to AuditLog with full message content
5. Counsellor Manager + Compliance notified on Continue

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G038` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G038: Compliance keyword guards — real-time on counsellor messages"`
Update `goals/_index.json` to mark this goal `done`.
