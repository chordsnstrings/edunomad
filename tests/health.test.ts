import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkHealth } from "../src/lib/health";

describe("health check (G181)", () => {
  it("reports ok with a reachable database", async () => {
    const h = await checkHealth();
    assert.equal(h.status, "ok");
    assert.equal(h.db, "ok");
    assert.ok(h.uptimeSeconds >= 0);
    assert.ok(h.version);
    assert.ok(Date.parse(h.time) > 0);
  });
});
