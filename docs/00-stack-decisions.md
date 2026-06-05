# Stack decisions

> Claude Code updates this file as decisions are made during the build.
> One entry per significant choice. Date + rationale.

## Format

Each decision is a short entry:

```
## YYYY-MM-DD — <topic>

**Choice:** <what we're using>
**Alternatives considered:** <what we didn't pick>
**Rationale:** <why this one — 2-3 sentences>
**Consequences:** <what this constrains downstream>
```

## Decisions

## 2026-06-05 — Framework

**Choice:** Next.js 16 (App Router, React 19, TypeScript), Turbopack.
**Alternatives considered:** Remix, SvelteKit.
**Rationale:** Best-in-class SEO (Metadata API, streaming SSR, file-based
`sitemap`/`robots`/`manifest`/`opengraph-image`), first-class PWA support, and
server components keep client JS minimal for the mobile-first performance
budgets. Server Actions cover mutations without a separate API layer.
**Consequences:** Routing, data fetching and metadata follow App Router
conventions. Edge "proxy" (formerly middleware) guards `/admin`.

## 2026-06-05 — Database & ORM

**Choice:** PostgreSQL 16 + Prisma 6. SQLite is NOT used.
**Alternatives considered:** SQLite for dev; Drizzle; Kysely.
**Rationale:** CLAUDE.md §1.3 mandates Postgres — the append-only hash-chained
audit log and event-sourced status need relational integrity. Prisma gives a
typed client and easy provider swap to managed Postgres (Neon/Supabase/RDS) via
`DATABASE_URL`. Developing directly against Postgres (not SQLite) avoids a later
migration and keeps dev/prod parity.
**Consequences:** A local cluster is provisioned by `scripts/setup-db.sh`
(also wired to a SessionStart hook for ephemeral web containers). Schema in
`prisma/schema.prisma`; mutations via Server Actions.

## 2026-06-05 — Styling & UI

**Choice:** Tailwind CSS v4 (CSS-first `@theme` tokens), Lucide icons, Inter via
`next/font`. Hand-built component primitives (Button, Card, Field, Toggle…).
**Alternatives considered:** shadcn/ui, Mantine, Chakra.
**Rationale:** Tailwind gives precise control over spacing ("perfect padding")
and mobile-first responsiveness; CSS variables map cleanly to the brand tokens
(navy #0B1A2E, gold #C9A84C, flat, 1px rules). A small bespoke component set
keeps the bundle lean and on-brand without a heavy library.
**Consequences:** Design tokens live in `src/app/globals.css`. Brand social
glyphs are inline SVGs (Lucide v1 dropped brand icons).

## 2026-06-05 — Validation & Auth

**Choice:** Zod for validation; `jose` (HS256 JWT cookie) + `bcryptjs` for the
admin session. Phone-OTP + full RBAC (goals G006–G011) remain the target.
**Alternatives considered:** NextAuth, Lucia, Clerk.
**Rationale:** The current scope needs a small, dependency-light, secure admin
login. `jose` is edge-compatible (used in the proxy guard); `bcryptjs` is pure
JS (no native build). Zod validates every Server Action input server-side.
**Consequences:** `AdminUser` table + 12h signed session cookie. This is a
deliberate stand-in to be replaced by the spec's OTP/RBAC system; RBAC is still
enforced server-side on every action (deny by default).

## 2026-06-05 — Object storage

**Choice:** S3-compatible storage via `@aws-sdk/client-s3` +
`@aws-sdk/s3-request-presigner`, with a local filesystem backend for dev.
**Alternatives considered:** UploadThing, direct fetch + manual SigV4.
**Rationale:** One API works across AWS S3 / Cloudflare R2 / DigitalOcean
Spaces / MinIO — chosen by `STORAGE_*` env. Signed download URLs default to a
15-minute expiry; large files upload via presigned PUT. Document binary is
never logged. The local backend (HMAC-signed `/api/storage` route) keeps dev
self-contained without cloud credentials.
**Consequences:** `src/lib/storage.ts` is the single entry point; the AWS SDK is
dynamically imported only when S3 is configured (keeps the dev path light).

## 2026-06-05 — i18n & ICU

**Choice:** `intl-messageformat` (FormatJS) with TS message catalogs per locale.
**Alternatives considered:** next-intl, react-intl, Lingui.
**Rationale:** Minimal footprint, full ICU (plurals/select), framework-agnostic
so it works in server components, route handlers and tests alike without
routing changes. EN is generated from the microcopy doc; BN/HI/NE fall back.
**Consequences:** `src/i18n/*`; locale via cookie/Accept-Language.

## 2026-06-05 — Observability (logging, errors, uptime)

**Choice:** Dependency-light structured logger (`src/lib/log.ts`, JSON lines)
+ Sentry for error monitoring (via `src/lib/monitoring.ts` + Next
`instrumentation.ts`), behind a provider-agnostic capture layer. Health at
`GET /api/health`; an external uptime monitor pings it every minute.
**Alternatives considered:** pino/winston (logging); Datadog/Rollbar (errors).
**Rationale:** The bespoke logger guarantees PII redaction at INFO and "never
log document binary" (CLAUDE.md §11) without a heavyweight dependency, and emits
JSON that any aggregator ingests. Sentry gives managed grouping + alert routing;
the abstraction keeps it swappable and makes it a no-op without `SENTRY_DSN`.
**Consequences:** Errors flow with stack traces + non-PII context; severity
drives on-call routing. `LOG_LEVEL` per env; DEBUG off in prod.

## 2026-06-05 — Analytics

**Choice:** Plausible by default (cookieless, no PII, no consent banner);
PostHog/GA4 selectable via `ANALYTICS_PROVIDER`. Funnels are driven off the
event catalog (`src/lib/analytics.ts`, hooked into `emit()`).
**Alternatives considered:** GA4-only, Segment, Amplitude.
**Rationale:** Privacy-respecting by default suits a cross-border student base;
deriving funnels from the source-of-truth event stream keeps product analytics
consistent with the audit log. No-op without a provider key.
**Consequences:** Signup→visa funnel tied to catalog events; PII stripped before
egress; consent only required if a cookie-based provider is selected.

## 2026-06-05 — Hosting, CI/CD & E2E

**Choice:** GitHub Actions for CI/CD; GitHub Environments for env-specific
secrets and a protected production-promote gate; host-agnostic deploy hook
(`scripts/deploy.sh`, `DEPLOY_CMD`). Playwright for E2E (mobile-first project) +
`@axe-core/playwright` for accessibility; Lighthouse CI for PWA/perf budgets.
**Alternatives considered:** CircleCI/GitLab CI; Cypress; vendor-locked deploy.
**Rationale:** Actions is already adjacent to the repo and integrates Environments
(approval + per-env secrets) cleanly. Playwright runs the mobile viewport, drives
real OTP auth, and hosts the axe checks in one runner. Host-agnostic deploy keeps
us portable across Vercel/Fly/containers.
**Consequences:** `.github/workflows/{ci,deploy,backup}.yml`; migrations via
`scripts/migrate.sh` with snapshot rollback; secrets validated by
`scripts/check-secrets.sh`.
