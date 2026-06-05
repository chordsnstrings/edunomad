# EduNomad

> Study abroad, simplified. A mobile-first PWA that guides students from
> Bangladesh, India and Nepal through applying to universities in Canada, the
> UK, Australia and Malaysia — all the way to visa approval and arrival.

This repository contains both the **running application** (a Next.js app) and
the **build specification** it's being constructed from (`CLAUDE.md`, `docs/`,
`goals/`). The spec is the source of truth; the app is built against it.

---

## What's implemented so far

The public marketing site + a full **company-settings admin panel**, built on
the spec's constraints (Postgres, mobile-first, brand baseline, SEO):

- **Everything is admin-editable.** Company name, tagline, descriptions, logo,
  contact details, social links, SEO/meta, analytics IDs and feature toggles
  all live in the database and are edited at `/admin` — no code changes, no
  redeploys.
- **Country-specific contact numbers.** Set a WhatsApp + call number per
  country. A visitor's country is detected from their IP (via CDN/host geo
  headers) and the right number is loaded automatically across the header, the
  contact section and the floating WhatsApp/call buttons. Visitors can also
  switch region manually. Falls back to a global default when there's no match.
- **Heavy SEO + LLM SEO.** Dynamic metadata, canonical URLs, Open Graph (with a
  generated share image), Twitter cards, rich **JSON-LD** (Organization with a
  `ContactPoint` per country, WebSite, Service, FAQPage), `sitemap.xml`,
  `robots.txt`, a PWA `manifest`, and **`/llms.txt` + `/llms-full.txt`** so AI
  assistants describe the company accurately.
- **Modern, minimal, fully responsive UI.** Navy + gold brand, flat surfaces,
  1px rules, Inter, 44px tap targets, mobile-first layout with consistent
  padding, safe-area-aware floating actions, and a `<details>`-based FAQ that
  needs zero JS.

## Quick start

```bash
# 1) Provision Postgres + write a dev .env + push schema + seed (idempotent)
bash scripts/setup-db.sh

# 2) Run the app
npm run dev          # http://localhost:3000
```

In Claude Code web sessions this runs automatically via a `SessionStart` hook
(see `.claude/settings.json`), because the container is ephemeral.

### Admin panel

- URL: `/admin` → sign in at `/admin/login`
- Default dev credentials (from `.env` / `ADMIN_EMAIL` / `ADMIN_PASSWORD`):
  `admin@edunomad.app` / `ChangeMe!123` — **change these in production.**
- Sections: General · Contact · Country numbers · Social · SEO · Analytics ·
  Display.

### Environment variables

See `.env.example`. The important ones:

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (swap for Neon/Supabase/RDS in prod) |
| `AUTH_SECRET` | Signs the admin session cookie — `openssl rand -hex 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded first admin account |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used by metadata/sitemap/robots |

## Tech stack

Next.js 16 (App Router, React 19, TS) · PostgreSQL 16 + Prisma 6 · Tailwind
CSS v4 · Zod · `jose` + `bcryptjs` (admin auth) · Lucide. See
`docs/00-stack-decisions.md` for the rationale behind each pick.

## Project structure (app)

```
src/
├── app/
│   ├── (site)/              # Public site (marketing chrome lives here)
│   │   ├── page.tsx         # Landing page
│   │   ├── privacy, terms   # Legal pages
│   │   └── layout.tsx       # Header + Footer + FloatingActions + JSON-LD
│   ├── admin/
│   │   ├── (dashboard)/     # Guarded: overview, settings, country numbers
│   │   ├── login/           # Public sign-in
│   │   └── actions.ts       # Server actions (login, save settings, country CRUD)
│   ├── llms.txt, llms-full.txt   # LLM SEO
│   ├── sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx
│   ├── layout.tsx           # Root: fonts, metadata, analytics
│   └── actions.ts           # Country override (geo) server action
├── components/{ui,site,admin}/
├── lib/                     # db, settings, geo, auth, session, seo, content…
├── proxy.ts                 # Edge guard for /admin
prisma/                      # schema.prisma + seed.mjs
scripts/setup-db.sh          # Idempotent Postgres provisioning
```

## How country detection works

1. **Override cookie** (`en_country`) set by the in-header region switcher.
2. **Geo headers** from your host/CDN — `x-vercel-ip-country` (Vercel),
   `cf-ipcountry` (Cloudflare), etc. — derived from the visitor's IP.
3. **Default** numbers from settings when neither is present.

Locally you can simulate it:

```bash
curl -s -H "x-vercel-ip-country: CA" http://localhost:3000/ | grep "Canada team"
curl -s -H "Cookie: en_country=IN"   http://localhost:3000/ | grep "India team"
```

---

## The build specification

This repo is also the EduNomad Phase 1 **build spec**. Claude Code reads
`CLAUDE.md` for standing orders and works through the goal files in `goals/`.

- `CLAUDE.md` — standing orders / constraints (read every session)
- `docs/` — data model, events, RBAC, workflows, reference data, SOP corpus
- `goals/_index.json` + `goals/G###-*.md` — 188 goals across 7 workflows + CC
- `.claude/commands/` — `/goals`, `/verify`, `/next`, `/status`, `/blocker`

### Non-negotiable constraints (CLAUDE.md §1)

PWA only · mobile-first (380px) · Postgres · 4 UI languages (EN/BN/HI/NE) ·
append-only hash-chained audit log · event-sourced status · WhatsApp Cloud API
plumbing · phone-OTP auth · multi-tenant · server-side RBAC (deny by default) ·
no off-platform money flows · Compliance sole sign-off on visa files.

### Deferred to Phase 2+

Native apps (never) · agency & service-partner UIs · inbound-email LLM
classification · field-level visa form filler · India/Nepal sources · UK/AU/MY
destinations.

> Spec drift across sessions is the highest risk. Changes to the spec go
> through `docs/`, `goals/_index.json` and `CLAUDE.md` with a `spec:` prefix.
