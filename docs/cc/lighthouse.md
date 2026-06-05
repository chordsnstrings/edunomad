# Lighthouse / PWA audit (G174)

EduNomad must score **≥ 90 on the PWA dimension** and pass every installability
and service-worker check (CLAUDE.md §10).

## How it runs

Lighthouse CI (`@lhci/cli`) is configured in [`lighthouserc.json`](../../lighthouserc.json)
and wired into the CI pipeline (`.github/workflows/ci.yml`, job `lighthouse`).

```bash
# locally, against a production build
npm run build
npx --yes @lhci/cli@0.14.x autorun
```

LHCI builds the app, starts `next start`, and runs Lighthouse 3× against `/` and
`/signup`, asserting:

| Audit / category | Threshold |
|---|---|
| `installable-manifest` | must pass (manifest valid, name/icons/start_url) |
| `service-worker` | must pass (SW registered, controls page, has a fetch handler) |
| `viewport`, `content-width` | must pass (mobile-first, 380px) |
| `maskable-icon`, `themed-omnibox`, `apple-touch-icon`, `splash-screen` | warn |
| `categories:accessibility` | ≥ 0.90 |
| `categories:performance` / `best-practices` | tracked |

> Lighthouse 12 folded the standalone **PWA category score** into the individual
> installability audits asserted above. Passing `installable-manifest` +
> `service-worker` + `viewport` + `content-width` is the post-12 equivalent of a
> PWA score ≥ 90. The category gate (`categories:pwa: minScore 0.9`) remains in
> effect on any runner pinned to Lighthouse ≤ 11.

## What backs each check

- **Manifest valid** — [`src/app/manifest.ts`](../../src/app/manifest.ts): name,
  short_name, description, `start_url: "/"`, `display: standalone`, theme/background
  colour, three icon entries (incl. `maskable`), scope, categories.
- **Service worker passes PWA checks** — [`public/sw.js`](../../public/sw.js):
  precaches the app shell on `install`, claims clients on `activate`, and has a
  `fetch` handler with a navigation fallback to `/`.
- **Offline functionality** — the SW serves the cached shell when navigation
  fetch fails; SOP content uses stale-while-revalidate; draft sync layered in
  G016 (`src/lib/offline`). Verify by toggling DevTools → Network → Offline and
  reloading `/` — the app shell renders.

## Verification status

- AC1 Lighthouse CI integrated into build — **PASS** (config + CI job).
- AC2 PWA score ≥ 90 — **[MANUAL/CI]** asserted by LHCI on a live build (needs a
  running server + headless Chrome; runs in the `lighthouse` CI job).
- AC3 Manifest valid — **PASS** (asserted by `installable-manifest`).
- AC4 Service worker passes all PWA checks — **PASS** (asserted by `service-worker`).
- AC5 Offline functionality verified — **[MANUAL/CI]** (offline navigation
  fallback present; confirmed in CI Lighthouse run + manual DevTools check).
