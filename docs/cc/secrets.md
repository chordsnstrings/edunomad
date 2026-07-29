# Secret management & rotation runbook (G184)

## Where secrets live

- **Never** in code or in a committed `.env`. `.gitignore` excludes `.env*`
  (only `.env.example`-style references are allowed). The CI **secret-scan** job
  (`scripts/check-secrets.sh`) fails the build if a credential is committed.
- **Local dev:** a developer's own `.env` (gitignored).
- **CI / staging / production:** the chosen secret manager, surfaced to the app
  as environment variables at runtime via GitHub **Environments** (env-specific
  secret sets) — staging and production never share a set.
- For a dedicated manager (AWS Secrets Manager / GCP Secret Manager / Doppler /
  Vault), the deploy step injects values into the process env at boot; the app
  reads only `process.env`, so the manager is swappable.

## Secret inventory (env-specific)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection (per env) |
| `AUTH_SECRET` | OTP hashing + admin session signing |
| `STORAGE_*` | S3-compatible object storage (documents) |
| `BACKUP_BUCKET`, `S3_ENDPOINT`, `BACKUP_AWS_*` | Backups |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Web Push |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` | WhatsApp Cloud API |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` | SMS fallback |
| `ANTHROPIC_API_KEY` | SOP polish / translation assist |
| `SENTRY_DSN` | Error monitoring |
| `ANALYTICS_PROVIDER`, `PLAUSIBLE_DOMAIN`, `POSTHOG_KEY` | Analytics |
| `CRON_SECRET` | Authenticates cron endpoints |
| `INBOUND_WEBHOOK_SECRET` | Authenticates the inbound-email webhook. Both fail CLOSED (503) when unset. |

Application secrets (document-vault credentials, etc.) are additionally
encrypted at rest with AES-256-GCM via `src/lib/crypto-vault.ts`.

## Rotation runbook

1. **Generate** the new secret in the provider (DB password, API key, VAPID
   pair, `AUTH_SECRET`).
2. **Stage it** in the secret manager for `staging` first.
3. **Deploy staging**, run smoke + E2E, confirm health green.
4. **Promote** the value to the `production` Environment.
5. **Redeploy production** (rolling) so new instances pick up the value.
6. **Revoke** the old credential at the provider once no instance uses it.
7. **Record** the rotation date in the ops log (no secret values in the log).

Rotate on a fixed cadence (≥ every 90 days) and **immediately** on any suspected
exposure. `AUTH_SECRET` rotation invalidates existing sessions/OTP hashes by
design — communicate the forced re-login.

## Verification

- AC1 Secret manager integrated — **PASS** (GitHub Environments; pluggable
  manager via env injection).
- AC2 Runtime loading — **PASS** (`process.env`, no build-time inlining of
  secrets).
- AC3 Repo has no secrets — **PASS** (CI `secret-scan` gate).
- AC4 Rotation runbook — **PASS** (this document).
