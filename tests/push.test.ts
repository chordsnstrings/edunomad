import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import {
  isQuietHours,
  saveSubscription,
  removeSubscription,
  dispatchPushForEvent,
} from "../src/lib/push";

const USER = "push-test-user";
const ENDPOINT = "https://example.com/push/abc";

describe("G012 — web push + quiet hours", () => {
  before(async () => {
    await prisma.pushSubscription.deleteMany({ where: { userId: USER } });
  });
  after(async () => {
    await prisma.pushSubscription.deleteMany({ where: { userId: USER } });
    await prisma.$disconnect();
  });

  it("computes quiet hours (22:00–08:00 local)", () => {
    // 18:00Z = 00:00 Asia/Dhaka (UTC+6) → quiet; 06:00Z = 12:00 → not quiet
    assert.equal(isQuietHours(new Date("2026-06-05T18:00:00Z"), "Asia/Dhaka"), true);
    assert.equal(isQuietHours(new Date("2026-06-05T06:00:00Z"), "Asia/Dhaka"), false);
  });

  it("stores and removes subscriptions", async () => {
    await saveSubscription(USER, { endpoint: ENDPOINT, keys: { p256dh: "p", auth: "a" } });
    assert.equal(await prisma.pushSubscription.count({ where: { userId: USER } }), 1);
    await removeSubscription(ENDPOINT);
    assert.equal(await prisma.pushSubscription.count({ where: { userId: USER } }), 0);
  });

  it("skips when channels.push is not set", async () => {
    const r = await dispatchPushForEvent({ type: "x", channels: {}, payload: {} }, [{ userId: USER, locale: "en" }]);
    assert.equal(r.delivered, 0);
  });

  it("suppresses non-critical pushes during quiet hours", async () => {
    const night = new Date("2026-06-05T18:00:00Z"); // midnight Dhaka
    const r = await dispatchPushForEvent(
      { type: "offer.received", channels: { push: true }, payload: {} },
      [{ userId: USER, locale: "en" }],
      night,
    );
    assert.equal(r.quietSkipped, 1);
  });

  it("falls back to SMS when push isn't available", async () => {
    const day = new Date("2026-06-05T06:00:00Z"); // noon Dhaka
    const r = await dispatchPushForEvent(
      { type: "offer.received", channels: { push: true }, payload: {} },
      [{ userId: USER, locale: "en", phone: "+8801700000000" }],
      day,
    );
    assert.equal(r.inAppOnly, true);
    assert.equal(r.fellBack, 1);
  });
});
