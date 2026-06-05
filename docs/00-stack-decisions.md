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

---

Remaining picks (queue/jobs, object storage, push, payments, i18n library,
hosting, analytics provider) to be recorded as those goals are tackled.
