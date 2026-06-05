import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { encryptSecret, decryptSecret } from "../src/lib/crypto-vault";

describe("G060 — credential vault encryption", () => {
  it("round-trips a secret", () => {
    const secret = "portal-password-123!";
    const enc = encryptSecret(secret);
    assert.notEqual(enc, secret);
    assert.equal(decryptSecret(enc), secret);
  });

  it("produces different ciphertext each time (random IV)", () => {
    assert.notEqual(encryptSecret("same"), encryptSecret("same"));
  });
});
