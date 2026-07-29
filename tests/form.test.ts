import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { text, requiredText, id, pick, int, bool, date, secret, json } from "../src/lib/form";

function fd(entries: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.append(k, v);
  return f;
}

describe("L21 — bounded server-action inputs", () => {
  it("does not turn a missing field into the string \"null\"", () => {
    // String(formData.get("x")) yields "null", which reached the database as data.
    assert.equal(text(fd({}), "x"), "");
    assert.equal(text(fd({ x: "null" }), "x"), "");
    assert.equal(text(fd({ x: "undefined" }), "x"), "");
  });

  it("bounds free text so one field cannot store megabytes", () => {
    assert.equal(text(fd({ x: "a".repeat(50_000) }), "x").length, 2000);
    assert.equal(text(fd({ x: "a".repeat(50_000) }), "x", 100).length, 100);
  });

  it("trims, and distinguishes required from optional", () => {
    assert.equal(text(fd({ x: "  hi  " }), "x"), "hi");
    assert.equal(requiredText(fd({ x: "   " }), "x"), null);
    assert.equal(requiredText(fd({ x: "hi" }), "x"), "hi");
  });

  it("rejects an implausible identifier rather than querying with it", () => {
    assert.equal(id(fd({ i: "abc-123_XYZ" }), "i"), "abc-123_XYZ");
    assert.equal(id(fd({ i: "a".repeat(200) }), "i"), null);
    assert.equal(id(fd({ i: "'; DROP TABLE" }), "i"), null);
    assert.equal(id(fd({}), "i"), null);
  });

  it("restricts a value to a fixed set", () => {
    const allowed = ["approve", "reject"] as const;
    assert.equal(pick(fd({ d: "approve" }), "d", allowed), "approve");
    assert.equal(pick(fd({ d: "delete_everything" }), "d", allowed), null);
  });

  it("clamps integers instead of accepting a negative amount", () => {
    assert.equal(int(fd({ n: "-50000" }), "n", { min: 1, max: 100 }), 1);
    assert.equal(int(fd({ n: "9999" }), "n", { min: 1, max: 100 }), 100);
    assert.equal(int(fd({ n: "abc" }), "n", { fallback: 45 }), 45);
    assert.equal(int(fd({}), "n", { fallback: 45 }), 45);
  });

  it("reads checkboxes and dates predictably", () => {
    assert.equal(bool(fd({ b: "on" }), "b"), true);
    assert.equal(bool(fd({ b: "false" }), "b"), false);
    assert.equal(bool(fd({}), "b"), false);
    assert.equal(date(fd({ d: "2026-01-02" }), "d")?.getUTCFullYear(), 2026);
    assert.equal(date(fd({ d: "not a date" }), "d"), null);
  });

  it("never rewrites a credential before it is hashed", () => {
    assert.equal(secret(fd({ p: "  pa ss  " }), "p"), "  pa ss  ");
    assert.equal(secret(fd({ p: "null" }), "p"), "null");
    assert.equal(secret(fd({ p: "x".repeat(5000) }), "p").length, 512);
  });

  it("gives editor JSON a ceiling it will not hit", () => {
    const blocks = JSON.stringify(Array.from({ length: 500 }, (_, i) => ({ type: "paragraph", text: `b${i}` })));
    assert.equal(json(fd({ blocks }), "blocks"), blocks);
    assert.doesNotThrow(() => JSON.parse(json(fd({ blocks }), "blocks")));
  });
});
