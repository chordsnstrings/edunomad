import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  FUNNEL,
  funnelStepForEvent,
  funnelOrder,
  sanitizeProps,
  analyticsConfig,
  trackEventFunnel,
} from "../src/lib/analytics";

describe("privacy-respecting analytics (G178)", () => {
  it("defines the signup -> visa funnel in order", () => {
    assert.deepEqual([...FUNNEL], ["signup", "profile", "eligibility", "shortlist_lock", "submitted", "offered", "visa"]);
    assert.ok(funnelOrder("visa") > funnelOrder("signup"));
  });

  it("maps catalog events to funnel steps", () => {
    assert.equal(funnelStepForEvent("profile.completed"), "profile");
    assert.equal(funnelStepForEvent("eligibility.checked"), "eligibility");
    assert.equal(funnelStepForEvent("shortlist.locked"), "shortlist_lock");
    assert.equal(funnelStepForEvent("application.submitted"), "submitted");
    assert.equal(funnelStepForEvent("application.approved"), "offered");
    assert.equal(funnelStepForEvent("visa.signed_off"), "visa");
    assert.equal(funnelStepForEvent("note.created"), null);
  });

  it("strips PII / identifying props before sending", () => {
    const out = sanitizeProps({ phone: "+880170", name: "Asha", studentId: "s1", destination: "CA", count: 3 });
    assert.equal(out.phone, undefined);
    assert.equal(out.name, undefined);
    assert.equal(out.studentId, undefined);
    assert.equal(out.destination, "CA");
    assert.equal(out.count, 3);
  });

  it("defaults to no provider (no-op, cookieless, no consent needed)", async () => {
    const cfg = analyticsConfig();
    assert.equal(cfg.provider, "none");
    assert.equal(cfg.consentRequired, false);
    // no provider -> returns the step but performs no network call, no throw
    const step = await trackEventFunnel("profile.completed", { destination: "CA" });
    assert.equal(step, "profile");
  });
});
