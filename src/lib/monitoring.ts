// Error monitoring + alerting (G177).
//
// Provider-agnostic capture layer. With SENTRY_DSN set, exceptions are
// forwarded to Sentry's ingest endpoint; without it, they fall back to the
// structured logger (still searchable in the log aggregator). Either way:
//   - stack traces are preserved,
//   - user context is reduced to NON-PII identifiers (userId / role / tenant),
//   - severity drives alert routing (page on-call vs. digest).
//
// Stack decision: docs/00-stack-decisions.md (Observability). Sentry chosen for
// the managed alerting/grouping; the abstraction keeps it swappable.

import { log, scrub } from "./log";
import { fetchWithTimeout } from "./http";

export type Severity = "fatal" | "error" | "warning" | "info";

export type UserContext = { userId?: string; role?: string; tenant?: string };

export type CaptureContext = {
  severity?: Severity;
  user?: UserContext;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

// Alert routing per severity (CLAUDE.md §10/§11; on-call rotation).
export const SEVERITY_ROUTES: Record<Severity, { channel: string; page: boolean }> = {
  fatal: { channel: "oncall-page", page: true },
  error: { channel: "oncall-slack", page: false },
  warning: { channel: "eng-digest", page: false },
  info: { channel: "eng-digest", page: false },
};

export function routeFor(severity: Severity) {
  return SEVERITY_ROUTES[severity] ?? SEVERITY_ROUTES.error;
}

/** Reduce arbitrary user context to non-PII identifiers only. */
export function sanitizeUser(user?: UserContext): UserContext {
  if (!user) return {};
  return {
    ...(user.userId ? { userId: user.userId } : {}),
    ...(user.role ? { role: user.role } : {}),
    ...(user.tenant ? { tenant: user.tenant } : {}),
  };
}

let initialized = false;
export function isMonitoringEnabled(): boolean {
  return Boolean(process.env.SENTRY_DSN);
}

async function forwardToSentry(payload: Record<string, unknown>): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  try {
    // Minimal Sentry "store" envelope; full SDK can replace this transport.
    const m = dsn.match(/^https:\/\/([^@]+)@([^/]+)\/(.+)$/);
    if (!m) return;
    const [, key, host, projectId] = m;
    const url = `https://${host}/api/${projectId}/store/`;
    await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${key}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Never let monitoring failures cascade into the request path.
  }
}

/** Capture an exception with stack trace + non-PII context, route the alert. */
export async function captureException(err: unknown, ctx: CaptureContext = {}): Promise<string> {
  const severity = ctx.severity ?? "error";
  const eventId = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/-/g, "");
  const error = err instanceof Error ? err : new Error(String(err));
  const route = routeFor(severity);

  const payload = {
    event_id: eventId,
    level: severity,
    platform: "node",
    timestamp: Date.now() / 1000,
    exception: { values: [{ type: error.name, value: error.message, stacktrace: { frames: framesFrom(error) } }] },
    user: sanitizeUser(ctx.user),
    tags: { ...(ctx.tags ?? {}), severity, alert_channel: route.channel },
    extra: scrub(ctx.extra ?? {}, true) as Record<string, unknown>,
  };

  // Always record locally (no PII), so errors are visible even without Sentry.
  log.error(error.message, { eventId, severity, alertChannel: route.channel, page: route.page, stack: error.stack, ...sanitizeUser(ctx.user) });

  if (!initialized) initialized = true;
  await forwardToSentry(payload);
  return eventId;
}

export async function captureMessage(message: string, ctx: CaptureContext = {}): Promise<string> {
  return captureException(new Error(message), ctx);
}

function framesFrom(error: Error): { filename: string; function: string }[] {
  const lines = (error.stack ?? "").split("\n").slice(1, 30);
  return lines.map((l) => {
    const m = l.match(/at\s+(.*?)\s+\((.*)\)/);
    return { function: m?.[1] ?? "?", filename: m?.[2] ?? l.trim() };
  });
}
