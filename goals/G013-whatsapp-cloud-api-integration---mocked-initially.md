---
id: G013
title: WhatsApp Cloud API integration — mocked initially
workflow: W0
deps: ["G005"]
size: M
status: not_started
owner: claude_code
---

# G013 — WhatsApp Cloud API integration — mocked initially

**Workflow:** W0 (Foundations)
**Dependencies:** G005
**Size:** M

## What

WhatsApp send interface. Mock for dev. Real impl activates when WHATSAPP_CLOUD_API_TOKEN env var set.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. whatsappSend(template_id, variables, recipient_phone) function exists
2. Templates loaded from docs/05-reference/whatsapp-templates.md
3. Mock implementation logs send, returns success in dev
4. Real impl activates when WHATSAPP_CLOUD_API_TOKEN set
5. SMS fallback via Twilio when WhatsApp fails or recipient hasn't opted in
6. Template approval status tracked per template × language

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G013` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G013: WhatsApp Cloud API integration — mocked initially"`
Update `goals/_index.json` to mark this goal `done`.
