import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderEventTemplate } from "../src/lib/event-templates";

describe("G017 — event template rendering with i18n", () => {
  it("substitutes variables via ICU", () => {
    const s = renderEventTemplate(
      { type: "counsellor.assigned", payload: { counsellor: "Asha" } },
      "en",
    );
    assert.ok(s.includes("Asha"));
  });

  it("applies ICU plural rules", () => {
    assert.ok(
      renderEventTemplate({ type: "shortlist.locked", payload: { count: 1 } }, "en").includes("1 programme"),
    );
    assert.ok(
      renderEventTemplate({ type: "shortlist.locked", payload: { count: 4 } }, "en").includes("4 programmes"),
    );
  });

  it("falls back to EN when the target template is empty", () => {
    // application.submitted has only EN — render in NE returns the EN text.
    const s = renderEventTemplate(
      { type: "application.submitted", payload: { university: "UofT" } },
      "ne",
    );
    assert.ok(s.includes("UofT"));
  });

  it("uses the localized template when present", () => {
    const s = renderEventTemplate(
      { type: "counsellor.assigned", payload: { counsellor: "Asha" } },
      "bn",
    );
    assert.ok(s.includes("কাউন্সেলর"));
  });

  it("humanizes unknown event types", () => {
    assert.equal(renderEventTemplate({ type: "some.new_thing" }, "en"), "Some New Thing");
  });
});
