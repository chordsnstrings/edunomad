import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createLogger, scrub } from "../src/lib/log";

function capture() {
  const lines: string[] = [];
  return { lines, sink: (l: string) => lines.push(l) };
}

describe("structured logger (G185)", () => {
  it("emits one JSON object per line", () => {
    const { lines, sink } = capture();
    const log = createLogger({ sink, minLevel: "info" });
    log.info("hello", { a: 1 });
    assert.equal(lines.length, 1);
    const rec = JSON.parse(lines[0]);
    assert.equal(rec.level, "info");
    assert.equal(rec.msg, "hello");
    assert.equal(rec.a, 1);
    assert.ok(rec.ts);
  });

  it("redacts PII at INFO", () => {
    const { lines, sink } = capture();
    const log = createLogger({ sink, minLevel: "info" });
    log.info("login", { phone: "+8801700000000", email: "a@b.com", role: "student" });
    const rec = JSON.parse(lines[0]);
    assert.equal(rec.phone, "[redacted]");
    assert.equal(rec.email, "[redacted]");
    assert.equal(rec.role, "student"); // non-PII passes through
  });

  it("keeps full detail at DEBUG (off in prod)", () => {
    const { lines, sink } = capture();
    const log = createLogger({ sink, minLevel: "debug" });
    log.debug("trace", { phone: "+8801700000000" });
    const rec = JSON.parse(lines[0]);
    assert.equal(rec.phone, "+8801700000000");
  });

  it("never logs document binary / base64 blobs", () => {
    const big = "A".repeat(2000);
    const out = scrub({ file: big, buf: Buffer.from("binary-bytes") }, true) as Record<string, string>;
    assert.match(out.file, /^\[binary \d+ chars\]$/);
    assert.match(out.buf, /^\[binary \d+ bytes\]$/);
  });

  it("suppresses below min level", () => {
    const { lines, sink } = capture();
    const log = createLogger({ sink, minLevel: "warn" });
    log.info("ignored");
    log.warn("kept");
    assert.equal(lines.length, 1);
    assert.equal(JSON.parse(lines[0]).msg, "kept");
  });
});
