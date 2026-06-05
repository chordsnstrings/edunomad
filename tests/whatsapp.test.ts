import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  whatsappSend,
  renderWhatsAppBody,
  getTemplateStatus,
} from "../src/lib/whatsapp";

describe("G013 — WhatsApp Cloud API (mocked)", () => {
  it("renders positional template variables", () => {
    const s = renderWhatsAppBody("counsellor_assigned", ["Asha", "Mr Roy"]);
    assert.ok(s.includes("Asha") && s.includes("Mr Roy"));
  });

  it("throws on unknown templates", () => {
    assert.throws(() => renderWhatsAppBody("does_not_exist", []));
  });

  it("mock-sends via WhatsApp in dev when opted in", async () => {
    const r = await whatsappSend("doc_request", ["passport"], "+8801700000000");
    assert.equal(r.ok, true);
    assert.equal(r.channel, "whatsapp");
    assert.equal(r.mock, true);
  });

  it("falls back to SMS when the recipient hasn't opted in", async () => {
    const r = await whatsappSend("doc_request", ["passport"], "+8801700000000", { optedIn: false });
    assert.equal(r.channel, "sms");
    assert.equal(r.ok, true);
  });

  it("tracks approval status per template × language", () => {
    assert.equal(getTemplateStatus("counsellor_assigned", "en"), "approved");
    assert.equal(getTemplateStatus("counsellor_assigned", "bn"), "pending");
    assert.equal(getTemplateStatus("nope", "en"), "rejected");
  });
});
