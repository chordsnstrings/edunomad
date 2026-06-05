#!/usr/bin/env bash
# Database migration runner with safety rollback (G180 AC4).
#
# Takes a pre-migration snapshot, applies migrations, and restores the snapshot
# if the migration fails — so a bad deploy never leaves the schema half-applied.
# Uses `prisma migrate deploy` when a migrations history exists, otherwise the
# schema-sync path (`prisma db push`).
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL must be set}"

SNAPSHOT="/tmp/pre-migrate-$(date +%Y%m%d-%H%M%S).dump"
echo "[migrate] snapshotting database -> $SNAPSHOT"
pg_dump --format=custom "$DATABASE_URL" > "$SNAPSHOT"

rollback() {
  echo "[migrate] FAILED — restoring pre-migration snapshot" >&2
  pg_restore --clean --if-exists --no-owner --dbname "$DATABASE_URL" "$SNAPSHOT" || true
  exit 1
}
trap rollback ERR

if [ -d "prisma/migrations" ] && [ -n "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "[migrate] applying prisma migrate deploy"
  npx prisma migrate deploy
else
  echo "[migrate] no migration history — syncing schema (prisma db push)"
  npx prisma db push --skip-generate
fi

echo "[migrate] hardening (append-only triggers)"
node prisma/harden.mjs

trap - ERR
echo "[migrate] done; snapshot retained at $SNAPSHOT"
