import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { captureException, sanitizeUser, routeFor, SEVERITY_ROUTES } from "../src/lib/monitoring";

describe("error monitoring (G177)", () => {
  it("captures an exception and returns an event id (no DSN -> log fallback)", async () => {
    const id = await captureException(new Error("boom"), { severity: "error", user: { userId: "u1", role: "student" } });
    assert.match(id, /^[a-f0-9]+$/);
  });

  it("reduces user context to non-PII identifiers only", () => {
    const u = sanitizeUser({ userId: "u1", role: "counsellor", tenant: "edunomad", phone: "+880170", name: "Asha" } as never);
    assert.deepEqual(u, { userId: "u1", role: "counsellor", tenant: "edunomad" });
    assert.equal((u as Record<string, unknown>).phone, undefined);
    assert.equal((u as Record<string, unknown>).name, undefined);
  });

  it("routes alerts by severity", () => {
    assert.equal(routeFor("fatal").page, true);
    assert.equal(routeFor("warning").page, false);
    assert.equal(SEVERITY_ROUTES.error.channel, "oncall-slack");
  });
});
