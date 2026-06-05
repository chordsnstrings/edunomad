import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { translate, formatCurrency, formatDate } from "../src/i18n/index";

describe("G010 — i18n (EN/BN/HI/NE, ICU)", () => {
  it("translates EN keys", () => {
    assert.equal(translate("en", "common.continue"), "Continue");
  });

  it("falls back to EN when a key is missing in the locale", () => {
    assert.equal(translate("bn", "common.save"), "Save");
  });

  it("uses the locale translation when present", () => {
    assert.equal(translate("bn", "common.continue"), "চালিয়ে যান");
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
