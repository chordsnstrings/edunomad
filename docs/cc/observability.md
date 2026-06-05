# Observability — logging, monitoring, analytics, uptime

Covers G177 (error monitoring), G178 (analytics), G181 (health/uptime),
G185 (logging).

## Logging (G185) — `src/lib/log.ts`

- **Structured JSON**, one object per line (`ts`, `level`, `msg`, …fields) — the
  log aggregator (Loki / CloudWatch / Datadog / GCP) parses JSON lines natively.
- **PII redaction at INFO and above.** DEBUG keeps full detail but is **OFF in
  production** (min level is INFO), so production never emits PII.
- **Document binary is never logged** at any level — Buffers/Uint8Arrays and
  long base64 / `data:` strings are summarised as `[binary N …]`.
- `LOG_LEVEL` overrides per env.

## Error monitoring (G177) — `src/lib/monitoring.ts` + `src/instrumentation.ts`

- Next's `onRequestError` routes server errors (route handlers, server
  components, server actions) into `captureException` with stack traces.
- **User context is reduced to non-PII identifiers** (`userId` / `role` /
  `tenant`); `extra` is PII-scrubbed.
- **Alert routing by severity:** `fatal` → page on-call; `error` →
  on-call Slack; `warning`/`info` → eng digest.
- Transport: Sentry when `SENTRY_DSN` is set; otherwise falls back to the
  structured logger (errors stay searchable without Sentry).

## Analytics (G178) — `src/lib/analytics.ts`

- **Default Plausible** (cookieless, no PII, no cross-site tracking) → **no
  consent banner required**. PostHog/GA4 selectable via `ANALYTICS_PROVIDER`;
  those gate on cookie consent.
- **Funnel is driven off the event catalog**: `emit()` forwards each catalog
  event to its funnel step (`signup → profile → eligibility → shortlist_lock →
  submitted → offered → visa`), fire-and-forget post-commit.
- PII/identifying props are stripped before any event is sent.
- No-op when no provider is configured (dev/tests).

## Health + uptime (G181) — `GET /api/health`

- Returns `200` `{status:"ok", db:"ok", uptimeSeconds, version, time}` when the
  DB is reachable; `503` `{status:"degraded", db:"error"}` otherwise.
- The external uptime monitor (provider — e.g. BetterStack / Pingdom / UptimeRobot)
  pings `/api/health` **every 1 minute** and **pages on-call after 2 consecutive
  failures** (configured in the monitor; see the on-call runbook).

## Rate-limit store note (G182)

The default rate-limit store is in-process (per instance). Behind multiple
instances, configure a shared store (Redis / Upstash) so limits are global; the
`rateLimit()` API is unchanged.
