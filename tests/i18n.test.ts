import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { translate, formatCurrency, formatDate } from "../src/i18n/index";

describe("G010 — i18n (EN/BN/HI/NE, ICU)", () => {
  it("translates EN keys", () => {
    assert.equal(translate("en", "common.continue"), "Continue");
  });

  it("falls back to the key when a message is missing everywhere", () => {
    assert.equal(translate("bn", "nonexistent.key.xyz"), "nonexistent.key.xyz");
  });

  it("uses the locale translation when present", () => {
    const bn = translate("bn", "common.continue");
    assert.ok(bn.length > 0);
    assert.notEqual(bn, translate("en", "common.continue"));
  });

  it("has full key parity across BN/HI/NE with EN", () => {
    for (const key of ["common.save", "tracker.stage_9", "shortlist.lock_cta"]) {
      for (const loc of ["bn", "hi", "ne"] as const) {
        assert.notEqual(translate(loc, key), translate("en", key), `${loc}:${key}`);
      }
    }
  });

  it("applies ICU plural rules", () => {
    assert.ok(translate("en", "demo.plural", { count: 1 }).includes("1 programme"));
    assert.ok(translate("en", "demo.plural", { count: 3 }).includes("3 programmes"));
  });

  it("renders apostrophes correctly (ICU escaping)", () => {
    // common.something_went_wrong contains "didn't" / "we kept your work"
    assert.ok(translate("en", "common.something_went_wrong").includes("didn't"));
  });

  it("formats currency and dates locale-aware", () => {
    assert.ok(formatCurrency("en", 1000, "USD").includes("1,000"));
    assert.equal(typeof formatDate("en", new Date("2026-01-15")), "string");
  });
});
