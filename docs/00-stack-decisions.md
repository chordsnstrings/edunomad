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

## 2026-06-06 — Hosting target: DigitalOcean

**Choice:** DigitalOcean **App Platform** (Dockerfile deploy) + **Managed
PostgreSQL 16** + **Spaces** (S3-compatible object storage). A production
multi-stage `Dockerfile` builds the Next.js standalone server; `.do/app.yaml`
declares the web service, the managed DB, and a `migrate` PRE_DEPLOY job
(`scripts/do-release.sh`).
**Alternatives considered:** Vercel + Neon; a bare Droplet with Docker Compose;
DigitalOcean Kubernetes.
**Rationale:** App Platform gives managed TLS (auto Let's Encrypt → satisfies the
HSTS/TLS goal), managed Postgres with backups/PITR, and Spaces reuses our existing
S3 client (`STORAGE_*`) with zero code change — one provider for compute, data and
storage. The Dockerfile keeps us portable (the same image runs on a Droplet/DOCR).
**Consequences:** Prisma generator gains `binaryTargets debian-openssl-3.0.x` for
the `node:22-slim` runtime; `next.config.ts` uses `output: "standalone"`; the
pre-deploy job is production-safe (demo fixtures gated behind `SEED_DEMO`). See
docs/cc/digitalocean.md.

## 2026-07-29 — Tenant identity: one convention, in constants

**Choice:** `tenantId` is a stable per-tenant-instance constant
(`src/lib/tenant.ts`), not a per-record uuid. Business data belongs to the
*operating* tenant — the organisation doing the work, `edunomad` in Phase 1 —
while `User.tenant`/`User.tenantId` describe where a person signs in. Every §4
core entity carries the column; the university catalogue (Institution,
Programme) is deliberately global.
**Alternatives considered:** a uuid per tenant row provisioned at signup; Postgres
row-level security; a `tenant` schema-per-org.
**Rationale:** Four writers had each invented their own value for a student's
`tenantId` — their own uuid, the inviting student's id, the literal `"student"` —
so the cross-tenant check in `can()` fired or not depending on which code path
had written the row. RLS is the stronger answer but needs a per-request session
variable through Prisma's pool; it stays open for Phase 2 when agency tenants
make it load-bearing.
**Consequences:** `TENANT_ID` / `OPERATING_TENANT_ID` constants; a schema-walking
test (`tests/services.test.ts`) forces every new model to be classified as
tenant-scoped or global rather than defaulting to unscoped.

## 2026-07-29 — Server-action input handling: helpers, not a schema per action

**Choice:** typed, bounded FormData readers (`src/lib/form.ts`) — `text`, `id`,
`pick`, `int`, `bool`, `date`, `secret`, `json` — used by every server action.
Zod stays for request bodies with real shape (`src/lib/validation.ts`).
**Alternatives considered:** a Zod schema per action; `next-safe-action`.
**Rationale:** 114 reads were `String(formData.get(x))`, which yields `"null"` for
a missing field, has no length ceiling, and never checks type. A schema per
action is more precise but 26 files of boilerplate for inputs that are almost all
one of eight shapes. The helpers are total by design — a server action has no
error channel back to a user who has already navigated — so callers check the
returned value instead of catching.
**Consequences:** `secret()` never trims (rewriting a passphrase before hashing
makes a correct password fail); `json()` carries a much larger ceiling so editor
payloads are not truncated into unparseable JSON.

## 2026-07-29 — Accessibility gating: axe in jsdom, blocking

**Choice:** `scripts/a11y-scan.mjs` runs axe-core inside jsdom against the real
server output and blocks the build on any serious/critical WCAG 2.1 A/AA
violation. Covers every public surface plus the authenticated consoles for six
roles (52 routes). `@axe-core/playwright` stays as advisory browser coverage.
**Alternatives considered:** making the existing Playwright a11y job blocking;
pa11y-ci.
**Rationale:** the Playwright job needs a browser download and sat behind
`continue-on-error` over four public routes — a gate that cannot fail. jsdom
needs no browser, so it can live in the main build job, and signing in through
the E2E bypass reaches the surfaces where the icon-only buttons and dialogs
actually are. Widening it immediately found a real defect (an `aria-label` on a
bare div in the route-level loading skeleton) that four public routes could not
have surfaced.
**Consequences:** `jsdom` as a devDependency; `npm run a11y`; Lighthouse stays
advisory and says why — its scores move with runner load, and a flaky gate
teaches people to ignore red — but now measures the 380px mobile viewport.

## 2026-07-29 — Client i18n: catalogue as a prop, not an import

**Choice:** `LocaleProvider` receives the active locale's catalogue from the
server; it no longer imports the message barrel. Server components keep using
`getTranslator`.
**Alternatives considered:** per-locale dynamic `import()` in the provider;
prefix-scoped catalogue subsets per surface.
**Rationale:** importing the barrel pulled all four catalogues into a client chunk
every page referenced — marketing pages and the 404 included — so a student in
Dhaka downloaded 107KB of Hindi and Nepali before seeing the homepage, on a
surface with a 3s TTI budget. A dynamic import splits per locale but flashes raw
keys on first paint. Prefix subsets are smaller still but silently break when
someone uses a key outside the declared prefixes.
**Consequences:** the root fallback provider ships no catalogue at all; a missing
client key warns loudly in development instead of rendering a raw key.
