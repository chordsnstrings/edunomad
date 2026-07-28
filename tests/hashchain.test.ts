import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { stableStringify, computeChainHash, GENESIS_HASH } from "../src/lib/hashchain";

describe("G005 — hash chain serialisation", () => {
  // Prisma omits undefined-valued keys when writing a JSON column. Hashing them
  // as null meant the digest was computed over a different object than the one
  // stored, so re-verification failed and the chain reported BROKEN forever
  // (events are append-only and a trigger blocks UPDATE/DELETE).
  it("omits undefined-valued keys, matching what is persisted", () => {
    assert.equal(
      stableStringify({ guardId: undefined, preview: "hi" }),
      stableStringify({ preview: "hi" }),
    );
    assert.equal(stableStringify({ a: undefined }), "{}");
  });

  it("still distinguishes an explicit null from an absent key", () => {
    assert.notEqual(stableStringify({ a: null }), stableStringify({}));
  });

  it("is unchanged for payloads without undefined values (back-compat)", () => {
    const payload = { amount: 1000, currency: "BDT", nested: { b: [1, 2], a: null } };
    assert.equal(
      stableStringify(payload),
      '{"amount":1000,"currency":"BDT","nested":{"a":null,"b":[1,2]}}',
    );
  });

  it("is order-independent and chains deterministically", () => {
    assert.equal(stableStringify({ b: 1, a: 2 }), stableStringify({ a: 2, b: 1 }));
    const h1 = computeChainHash({ x: 1 }, GENESIS_HASH);
    assert.equal(h1, computeChainHash({ x: 1 }, GENESIS_HASH));
    assert.notEqual(h1, computeChainHash({ x: 1 }, h1));
  });
});
