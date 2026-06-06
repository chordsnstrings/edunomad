#!/usr/bin/env bash
# DigitalOcean release task — runs as a PRE_DEPLOY job before the new web
# deployment goes live (see .do/app.yaml). Idempotent; safe to re-run.
#
#   1. sync the schema to the managed Postgres (we use `db push`, no migration
#      history) — Prisma CLI is fetched via npx so it isn't shipped in the lean
#      runtime image (the job needs outbound npm access);
#   2. (re)apply the append-only hash-chain triggers;
#   3. seed reference + bootstrap data.
#
# Production-safe by default: settings, the admin user (from ADMIN_EMAIL /
# ADMIN_PASSWORD) and the institution/programme catalogue are seeded; the DEMO
# staff/SOP fixtures are only seeded when SEED_DEMO=1.
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL must be set}"
export npm_config_cache="${npm_config_cache:-/tmp/.npm}"

echo "[release] syncing schema (prisma db push)"
npx --yes prisma@6 db push --skip-generate

echo "[release] applying append-only triggers"
node prisma/harden.mjs

echo "[release] seeding settings + admin + catalogue"
node prisma/seed.mjs
node prisma/seed-catalog.mjs

if [ "${SEED_DEMO:-}" = "1" ]; then
  echo "[release] SEED_DEMO=1 — seeding demo staff + SOP fixtures"
  node prisma/seed-team.mjs
  node prisma/seed-ops.mjs
  node prisma/seed-sop.mjs
fi

echo "[release] done"
