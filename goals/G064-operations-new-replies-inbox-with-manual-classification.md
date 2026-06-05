---
id: G064
title: Operations 'new replies' inbox with manual classification
workflow: W2
deps: ["G063"]
size: M
status: not_started
owner: claude_code
---

# G064 — Operations 'new replies' inbox with manual classification

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G063
**Size:** M

## What

Inbox of inbound emails. Ops opens email → classifies manually (offer/conditional/reject/RFI/acknowledge) with one tap → status updates.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Inbox lists unread replies sorted by received time
2. Open email shows full thread + attachments
3. 5 classification buttons (offer/conditional/reject/RFI/acknowledge)
4. Classification creates corresponding event (offer.unconditional_received, etc.) with confidence=1.0
5. Attached offer letter / supporting docs uploaded to vault as Documents
6. Interface accepts (classification, confidence) pair so future LLM classifier can plug in

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G064` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G064: Operations 'new replies' inbox with manual classification"`
Update `goals/_index.json` to mark this goal `done`.
