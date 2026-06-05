# Accessibility — WCAG AA validation (G176)

CLAUDE.md §9 sets a WCAG AA floor on primary user flows.

## Automated — axe-core in CI (AC1)

`e2e/a11y.spec.ts` runs **axe-core** (`@axe-core/playwright`) against the primary
public flows (`/`, `/signup`, `/welcome`, `/eligibility`) with the
`wcag2a/wcag2aa/wcag21a/wcag21aa` rule tags. The test **fails CI on any serious
or critical violation** (part of the `e2e` job). The same spec asserts the first
`Tab` moves focus to an interactive element (keyboard reachability).

To run locally: `npm run build && npm run test:e2e -- a11y`.

## Manual screen-reader walkthrough (AC2)

Run on a real device per release; record pass/fail per flow:

| Flow | Screen reader | Checks |
|---|---|---|
| Signup (OTP) | VoiceOver (iOS) / TalkBack (Android) | phone field labelled; OTP inputs announce position; errors announced via live region |
| Profile builder | VoiceOver / TalkBack | each step labelled; progress announced; save-on-blur status announced |
| Shortlist lock | VoiceOver / TalkBack | lock CTA announces consequence; confirmation announced |
| Payment | VoiceOver / TalkBack | amount + currency announced; status (success/failure) in a live region |

These authenticated flows need a logged-in fixture + a screen reader, so they are
**[MANUAL]** and signed off on the release checklist.

## Keyboard navigation (AC3)

Every screen is operable by keyboard: visible focus rings (`globals.css`),
logical tab order (single-column forms), Enter/Space activate controls, and no
keyboard traps. Spot-checked automatically in `a11y.spec.ts`; full sweep is part
of the manual pass.

## Colour-is-never-the-only-signal (AC4)

Status is always conveyed by **text + icon**, not colour alone:

- Audit results: `denied`/`failed`/`ok` carry the **word** plus colour.
- Document status, chain-integrity badges, payment status: icon (Lucide line
  icon) **and** label accompany every colour.
- Large-font mode toggle is available (parents primarily) per §9.

Audit method: grep for colour-only patterns (a bare coloured dot/badge with no
adjacent text) during the manual pass; none remain on the primary flows.
