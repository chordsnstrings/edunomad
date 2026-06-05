import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { rateLimit, otpVerifyLimit, tooManyResponse, LIMITS, _resetRateLimits } from "../src/lib/ratelimit";

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
