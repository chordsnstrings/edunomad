# Deploying EduNomad to DigitalOcean

EduNomad ships a production **Dockerfile** (Next.js 16 standalone + Prisma 6) and
a **DigitalOcean App Platform** spec. App Platform is the recommended path
(managed TLS, managed Postgres, zero-ops); the same image also runs on a Droplet.

## What you provision on DigitalOcean

| Need | DigitalOcean product |
|---|---|
| App runtime (web) | **App Platform** service (from `Dockerfile`) |
| Database | **Managed PostgreSQL 16** (the `db` in `.do/app.yaml`, or a dedicated cluster) |
| Document storage | **Spaces** (S3-compatible) + a Spaces access key |
| TLS / domain | App Platform domain (auto Let's Encrypt) |
| Backups | Managed PG automated backups + `scripts/backup.sh` to Spaces |

## Option A — App Platform (recommended)

### 1. Prerequisites
- `doctl` installed and authenticated (`doctl auth init`).
- The GitHub repo connected to DigitalOcean (Apps → GitHub authorization).

### 2. Create a Spaces bucket
Create a Space (e.g. `edunomad-docs`, region `nyc3`) and a Spaces access
key/secret. These map to `STORAGE_*` (the app's S3 client targets Spaces via
`STORAGE_ENDPOINT=https://nyc3.digitaloceanspaces.com`).

### 3. Create the app
```bash
doctl apps create --spec .do/app.yaml
```
This provisions the web service, the dev-tier managed Postgres (`db`), and the
`migrate` PRE_DEPLOY job. Bind happens automatically via `${db.DATABASE_URL}`.

### 4. Set the secrets
In the dashboard (App → Settings → App-Level Environment Variables) replace every
`REPLACE_ME`:
- `AUTH_SECRET` (32+ random bytes), `CRON_SECRET`
- `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY` (Spaces key)
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` (`npx web-push generate-vapid-keys`)
- `ADMIN_PASSWORD` (first super-admin login)
- Optional: `WHATSAPP_*`, `TWILIO_*`, `ANTHROPIC_API_KEY`, `SENTRY_DSN`
  (these stay mocked/no-op until set — see docs/cc/secrets.md).

Then redeploy: `doctl apps update <app-id> --spec .do/app.yaml`.

### 5. Migrations + seed
The `migrate` job runs `scripts/do-release.sh` on every deploy **before** the new
web release goes live: `prisma db push` → append-only triggers → seed settings +
admin + the institution/programme catalogue. It is **production-safe** — the demo
staff/SOP fixtures only seed when `SEED_DEMO=1`. (Outbound npm access is required;
the lean image fetches the Prisma CLI via `npx`.)

### 6. Domain + TLS (satisfies G183)
Add your domain under App → Settings → Domains. App Platform issues and
auto-renews a Let's Encrypt cert, serves HTTPS only, and our `next.config.ts`
adds the HSTS header in production.

### 7. Health, logs, alerts
- Health check probes `GET /api/health` (200 when the DB is reachable).
- Point the uptime monitor (docs/cc/observability.md) at `/api/health`.
- Configure App Platform deploy/alert notifications for the on-call.

## Option B — Droplet (Docker)

```bash
# build + run the same image on a Droplet (or push to DOCR)
docker build -t edunomad:latest .
docker run -d --env-file .env -p 3000:3000 --name edunomad edunomad:latest
# one-time / per-release migrations:
docker run --rm --env-file .env edunomad:latest bash scripts/do-release.sh
```
Front the container with Caddy or nginx for TLS (Let's Encrypt) and proxy to
`:3000`. Use a Managed Postgres `DATABASE_URL` and Spaces for `STORAGE_*`.

## Notes
- `DATABASE_URL` for Managed PG includes `?sslmode=require` — Prisma handles it.
- The Prisma engine target `debian-openssl-3.0.x` (schema generator) matches the
  `node:22-slim` runtime; the image installs `openssl`.
- Scale by raising `instance_count` / `instance_size_slug` in `.do/app.yaml`.
- The 6-year append-only retention job (`POST /api/cron/retention`) and the parent
  digest cron are driven by an external scheduler hitting the deployed URL with
  the `x-cron-secret` header (`CRON_SECRET`).
