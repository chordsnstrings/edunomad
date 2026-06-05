import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { emit, markEventRead } from "../src/lib/events";
import { getActivityFeed, roleToVisibilityCode } from "../src/lib/feed";

const STU = "feed-test-student";
const created: string[] = [];

describe("G018 — activity feed + visibility filtering", () => {
  after(async () => {
    await prisma.eventRead.deleteMany({ where: { eventId: { in: created } } });
    await prisma.$executeRawUnsafe(`ALTER TABLE "Event" DISABLE TRIGGER USER`);
    await prisma.event.deleteMany({ where: { id: { in: created } } });
    await prisma.$executeRawUnsafe(`ALTER TABLE "Event" ENABLE TRIGGER USER`);
    await prisma.$disconnect();
  });

  it("filters by role visibility code", async () => {
    const visible = await emit({ type: "counsellor.message_sent", stage: 2, actorType: "counsellor", studentId: STU, visibility: { C: true, S: true } });
    const hidden = await emit({ type: "payment.received", stage: 7, actorType: "finance", studentId: STU, visibility: { F: true } });
    created.push(visible.id, hidden.id);

    const feed = await getActivityFeed({ roleShort: "C", studentId: STU, locale: "en" });
    const ids = feed.items.map((i) => i.id);
    assert.ok(ids.includes(visible.id));
    assert.ok(!ids.includes(hidden.id));
    assert.ok(feed.items[0].rendered.length > 0); // rendered template present
  });

  it("paginates with a cursor", async () => {
    const a = await emit({ type: "doc.requested", stage: 4, actorType: "ops", studentId: STU, visibility: { O: true } });
    const b = await emit({ type: "doc.requested", stage: 4, actorType: "ops", studentId: STU, visibility: { O: true } });
    const c = await emit({ type: "doc.requested", stage: 4, actorType: "ops", studentId: STU, visibility: { O: true } });
    created.push(a.id, b.id, c.id);

    const p1 = await getActivityFeed({ roleShort: "O", studentId: STU, locale: "en", limit: 2 });
    assert.equal(p1.items.length, 2);
    assert.notEqual(p1.nextCursor, null);
    const p2 = await getActivityFeed({ roleShort: "O", studentId: STU, locale: "en", limit: 2, cursor: p1.nextCursor });
    assert.ok(p2.items.length >= 1);
    // newest first, no overlap
    assert.ok(!p2.items.some((i) => p1.items.find((j) => j.id === i.id)));
  });

  it("reports read state from EventRead", async () => {
    const e = await emit({ type: "offer.received", stage: 6, actorType: "system", studentId: STU, visibility: { S: true } });
    created.push(e.id);
    await markEventRead("feed-user", e.id);
    const feed = await getActivityFeed({ roleShort: "S", studentId: STU, userId: "feed-user", locale: "en" });
    const item = feed.items.find((i) => i.id === e.id);
    assert.equal(item?.read, true);
  });

  it("maps roles to visibility codes", () => {
    assert.equal(roleToVisibilityCode("compliance"), "COMP");
    assert.equal(roleToVisibilityCode("super_admin"), "ADMIN");
  });
});
