---
id: G109
title: Parent-counsellor chat with auto-translation
workflow: W4
deps: ["G013", "G103"]
size: L
status: not_started
owner: claude_code
---

# G109 — Parent-counsellor chat with auto-translation

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G013, G103
**Size:** L

## What

Parent messages counsellor. Messages auto-translate between languages.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Chat thread visible to parent + counsellor
2. Messages tagged with sender's language
3. Auto-translation via chosen service (Claude API or specialised)
4. Both parties see original + translated
5. Counsellor's view shows their language by default; toggle to see original

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G109` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G109: Parent-counsellor chat with auto-translation"`
Update `goals/_index.json` to mark this goal `done`.
