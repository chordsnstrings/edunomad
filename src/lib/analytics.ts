// Privacy-respecting product analytics (G178).
//
// Default provider is Plausible (cookieless, no cross-site tracking, no PII,
// EU-hosted) — so no consent banner is required. PostHog / GA4 can be selected
// via ANALYTICS_PROVIDER; those use cookies and therefore gate on consent.
// Without a provider configured the module is a no-op (dev / tests).
//
// Funnels are driven off the EVENT CATALOG (docs/02-events.md): each tracked
// business event maps to a funnel step, so product funnels stay in lock-step
// with the source-of-truth event stream. NO PII ever leaves this module.
//
// Stack decision: docs/00-stack-decisions.md (Analytics).

import { scrub } from "./log";

export type Provider = "plausible" | "posthog" | "ga4" | "none";

export function analyticsConfig(): { provider: Provider; cookieless: boolean; consentRequired: boolean } {
  const provider = (process.env.ANALYTICS_PROVIDER as Provider) || "none";
  const cookieless = provider === "plausible" || provider === "none";
  return { provider, cookieless, consentRequired: !cookieless };
}

export function isAnalyticsEnabled(): boolean {
  return analyticsConfig().provider !== "none";
}

// Ordered conversion funnel for the student journey (CLAUDE.md §5 stages).
export const FUNNEL = [
  "signup",
  "profile",
  "eligibility",
  "shortlist_lock",
  "submitted",
  "offered",
  "visa",
] as const;
export type FunnelStep = (typeof FUNNEL)[number];

// Event-catalog type -> funnel step. Keeps analytics tied to real events.
const EVENT_STEP_MAP: Record<string, FunnelStep> = {
  "account.created": "signup",
  "profile.completed": "profile",
  "eligibility.checked": "eligibility",
  "shortlist.locked": "shortlist_lock",
  "application.submitted": "submitted",
  "application.approved": "offered",
  "offer.received": "offered",
  "visa.signed_off": "visa",
  "visa.decision_approved": "visa",
};

export function funnelStepForEvent(eventType: string): FunnelStep | null {
  return EVENT_STEP_MAP[eventType] ?? null;
}

export function funnelOrder(step: FunnelStep): number {
  return FUNNEL.indexOf(step);
}

// Property keys we refuse to forward even if a caller passes them.
const FORBIDDEN_PROPS = new Set([
  "phone", "email", "name", "fullName", "dob", "address", "passport", "studentId",
]);

/** Strip PII / identifying keys from analytics props (defence in depth). */
export function sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (FORBIDDEN_PROPS.has(k)) continue;
    out[k] = v;
  }
  return scrub(out, true) as Record<string, unknown>;
}

async function send(name: string, props: Record<string, unknown>): Promise<void> {
  const { provider } = analyticsConfig();
  if (provider === "none") return;
  try {
    if (provider === "plausible") {
      const domain = process.env.PLAUSIBLE_DOMAIN;
      const host = process.env.PLAUSIBLE_HOST || "https://plausible.io";
      if (!domain) return;
      await fetch(`${host}/api/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "edunomad-server" },
        body: JSON.stringify({ name, domain, url: `app://${name}`, props }),
      });
    } else if (provider === "posthog") {
      const key = process.env.POSTHOG_KEY;
      const host = process.env.POSTHOG_HOST || "https://app.posthog.com";
      if (!key) return;
      await fetch(`${host}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: key, event: name, properties: props }),
      });
    }
    // ga4 transport intentionally omitted server-side (client gtag).
  } catch {
    // analytics must never break a request
  }
}

/** Track an arbitrary product event (PII-stripped, no-op without a provider). */
export async function track(name: string, props: Record<string, unknown> = {}): Promise<void> {
  await send(name, sanitizeProps(props));
}

/** Track a funnel step derived from a catalog event. Returns the step or null. */
export async function trackEventFunnel(eventType: string, props: Record<string, unknown> = {}): Promise<FunnelStep | null> {
  const step = funnelStepForEvent(eventType);
  if (!step) return null;
  await track(`funnel:${step}`, { ...props, step, order: funnelOrder(step) });
  return step;
}
