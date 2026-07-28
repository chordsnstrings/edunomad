// Rate limiting on public endpoints (G182).
//
// Fixed-window counter, fail-OPEN (a limiter bug must never lock users out).
// Default store is in-process (per-instance) which is correct for single-node
// and a safe lower bound behind a load balancer; set a Redis/Upstash store in
// production for cross-instance limits (see docs/cc/observability.md).
//
// Limits (CLAUDE.md §11):
//   - OTP send:   3 / hour / phone   (also enforced in lib/otp.ts at the DB)
//   - OTP verify: 5 / hour / phone
//   - General API: 100 / min / session
//
// On breach, callers return 429 with a Retry-After header (see tooManyResponse).

export type RateResult = { ok: boolean; remaining: number; limit: number; retryAfterMs: number };

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of store) if (b.resetAt <= now) store.delete(k);
}

/** Core fixed-window limiter. Fails open on any internal error. */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateResult {
  try {
    sweep(now);
    const existing = store.get(key);
    if (!existing || existing.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, remaining: limit - 1, limit, retryAfterMs: 0 };
    }
    if (existing.count >= limit) {
      return { ok: false, remaining: 0, limit, retryAfterMs: existing.resetAt - now };
    }
    existing.count += 1;
    return { ok: true, remaining: limit - existing.count, limit, retryAfterMs: 0 };
  } catch {
    return { ok: true, remaining: limit, limit, retryAfterMs: 0 };
  }
}

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;

export const LIMITS = {
  otpSend: { limit: 3, windowMs: HOUR },
  otpVerify: { limit: 5, windowMs: HOUR },
  api: { limit: 100, windowMs: MIN },
  // Admin password + TOTP entry: unlimited attempts made the console brute-forceable.
  adminLogin: { limit: 10, windowMs: 15 * MIN },
} as const;

export const otpSendLimit = (phone: string) =>
  rateLimit(`otp:send:${phone}`, LIMITS.otpSend.limit, LIMITS.otpSend.windowMs);

export const otpVerifyLimit = (phone: string) =>
  rateLimit(`otp:verify:${phone}`, LIMITS.otpVerify.limit, LIMITS.otpVerify.windowMs);

export const adminLoginLimit = (email: string) =>
  rateLimit(`admin:login:${email.toLowerCase()}`, LIMITS.adminLogin.limit, LIMITS.adminLogin.windowMs);

export const apiLimit = (sessionKey: string) =>
  rateLimit(`api:${sessionKey}`, LIMITS.api.limit, LIMITS.api.windowMs);

/** Build a standard 429 with Retry-After (seconds) + rate-limit headers. */
export function tooManyResponse(r: RateResult): Response {
  const retryAfter = Math.ceil(r.retryAfterMs / 1000);
  return new Response(JSON.stringify({ error: "rate_limited", retryAfter }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfter),
      "X-RateLimit-Limit": String(r.limit),
      "X-RateLimit-Remaining": String(r.remaining),
    },
  });
}

/** Test/maintenance helper. */
export function _resetRateLimits() {
  store.clear();
  lastSweep = 0;
}
