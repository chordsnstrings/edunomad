import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateSecret, totp, verifyTotp, base32Decode, base32Encode } from "../src/lib/totp";

describe("G011 — TOTP (RFC 6238)", () => {
  it("round-trips base32", () => {
    const buf = Buffer.from("hello world");
    assert.deepEqual(base32Decode(base32Encode(buf)), buf);
  });

  it("matches the RFC 6238 SHA-1 test vector (T=59 → 287082)", () => {
    const secret = base32Encode(Buffer.from("12345678901234567890"));
    assert.equal(totp(secret, 59 * 1000), "287082");
  });

  it("verifies a freshly generated code and rejects a wrong one", () => {
    const secret = generateSecret();
    const code = totp(secret);
    assert.equal(verifyTotp(secret, code), true);
    const wrong = String((Number(code) + 1) % 1_000_000).padStart(6, "0");
    assert.equal(verifyTotp(secret, wrong), false);
  });
});
