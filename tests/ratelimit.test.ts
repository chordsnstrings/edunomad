import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { rateLimit, otpVerifyLimit, tooManyResponse, LIMITS, _resetRateLimits } from "../src/lib/ratelimit";
import { clientIpFrom } from "../src/lib/client-ip";

describe("rate limiting (G182)", () => {
  beforeEach(() => _resetRateLimits());

  it("allows up to the limit then blocks within the window", () => {
    const key = "test:k1";
    for (let i = 0; i < 3; i++) {
      assert.equal(rateLimit(key, 3, 60_000).ok, true);
    }
    const blocked = rateLimit(key, 3, 60_000);
    assert.equal(blocked.ok, false);
    assert.ok(blocked.retryAfterMs > 0);
  });

  it("resets after the window elapses", () => {
    const key = "test:k2";
    const t0 = 1_000_000;
    assert.equal(rateLimit(key, 1, 1000, t0).ok, true);
    assert.equal(rateLimit(key, 1, 1000, t0 + 500).ok, false);
    assert.equal(rateLimit(key, 1, 1000, t0 + 1500).ok, true);
  });

  it("OTP verify is 5/hour per phone", () => {
    assert.equal(LIMITS.otpVerify.limit, 5);
    assert.equal(LIMITS.otpVerify.windowMs, 60 * 60 * 1000);
    let last = otpVerifyLimit("+8801700000001");
    for (let i = 0; i < 4; i++) last = otpVerifyLimit("+8801700000001");
    assert.equal(last.ok, true);
    assert.equal(otpVerifyLimit("+8801700000001").ok, false);
  });

  it("429 carries Retry-After + rate-limit headers", () => {
    const res = tooManyResponse({ ok: false, remaining: 0, limit: 5, retryAfterMs: 30_000 });
    assert.equal(res.status, 429);
    assert.equal(res.headers.get("Retry-After"), "30");
    assert.equal(res.headers.get("X-RateLimit-Limit"), "5");
  });
});

describe("L9 — client IP resolution behind a proxy", () => {
  const h = (v: Record<string, string>) => ({ get: (k: string) => v[k.toLowerCase()] ?? null });

  it("ignores a client-supplied prefix and uses the hop the LB appended", () => {
    // Attacker sends `X-Forwarded-For: 9.9.9.9`; the LB appends the real IP.
    assert.equal(clientIpFrom(h({ "x-forwarded-for": "9.9.9.9, 203.0.113.7" }), 1), "203.0.113.7");
  });

  it("varying the spoofed prefix cannot mint new buckets", () => {
    const a = clientIpFrom(h({ "x-forwarded-for": "1.1.1.1, 203.0.113.7" }), 1);
    const b = clientIpFrom(h({ "x-forwarded-for": "2.2.2.2, 203.0.113.7" }), 1);
    assert.equal(a, b);
  });

  it("honours a deeper trusted-hop count", () => {
    assert.equal(
      clientIpFrom(h({ "x-forwarded-for": "9.9.9.9, 203.0.113.7, 10.0.0.1" }), 2),
      "203.0.113.7",
    );
  });

  it("falls back rather than returning nothing on a short chain", () => {
    assert.equal(clientIpFrom(h({ "x-forwarded-for": "203.0.113.7" }), 2), "203.0.113.7");
    assert.equal(clientIpFrom(h({ "x-real-ip": "203.0.113.9" }), 1), "203.0.113.9");
    assert.equal(clientIpFrom(h({}), 1), null);
  });

  it("keeps the unattributed bucket tighter than a session's", () => {
    assert.ok(LIMITS.anon.limit < LIMITS.api.limit);
  });
});
