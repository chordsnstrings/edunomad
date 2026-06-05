# Deployment & CI/CD (G180)

## Environments

| Env | Branch / trigger | Database | Secrets source |
|---|---|---|---|
| **staging** | auto on push to `main` | staging Postgres | GitHub Environment `staging` |
| **production** | manual `workflow_dispatch` → `production` | production Postgres | GitHub Environment `production` (protected) |

Production is a **protected** GitHub Environment: the `deploy-production` job
requires a reviewer's approval before it runs. That approval is the "manual
promote to production" gate (AC3). Staging and production never share a database
or a secret set (AC1, AC5).

## CI pipeline — `.github/workflows/ci.yml`

Runs on every PR and on `main`:

1. **Lint** — `npm run lint`
2. **Type-check** — `tsc --noEmit`
3. **Test** — `npm test` (Node test runner against a Postgres service container)
4. **Build** — `NODE_ENV=production npm run build`
5. **Lighthouse** — PWA + budgets (`npm run lighthouse`) — needs `build-test`
6. **E2E** — Playwright (`npm run test:e2e`) incl. axe-core a11y — needs `build-test`
7. **Secret scan** — `scripts/check-secrets.sh`

AC2 (lint, test, type-check, build) is the `build-test` job.

## CD pipeline — `.github/workflows/deploy.yml`

- **staging**: push to `main` → migrate → build → deploy.
- **production**: manual dispatch with `environment=production` → reviewer
  approval → migrate → build → deploy.

`scripts/deploy.sh` is host-agnostic; set `DEPLOY_CMD` in each Environment to the
provider command (Vercel / Fly / container registry push).

## Migrations with safety rollback (AC4)

`scripts/migrate.sh` snapshots the database (`pg_dump`) **before** applying
schema changes and **restores the snapshot if the migration fails** — a failed
deploy never leaves a half-applied schema. It uses `prisma migrate deploy` when a
migration history exists, otherwise `prisma db push`, then re-applies the
append-only hardening triggers.

## Stack decision

Recorded in `docs/00-stack-decisions.md` (Hosting & CI/CD): GitHub Actions for
CI/CD, GitHub Environments for env-specific secrets + the production approval
gate, host-agnostic deploy hook.
