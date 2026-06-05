import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { emit, verifyEventChain, markEventRead } from "../src/lib/events";

const created: string[] = [];

async function deleteEventsBypassingTrigger(ids: string[]) {
  if (ids.length === 0) return;
  await prisma.$executeRawUnsafe(`ALTER TABLE "Event" DISABLE TRIGGER USER`);
  await prisma.event.deleteMany({ where: { id: { in: ids } } });
  await prisma.$executeRawUnsafe(`ALTER TABLE "Event" ENABLE TRIGGER USER`);
}

describe("G005 — event spine + hash chain", () => {
  after(async () => {
    await prisma.eventRead.deleteMany({ where: { eventId: { in: created } } });
    await deleteEventsBypassingTrigger(created);
    await prisma.$disconnect();
  });

  it("emits events with a chain hash and keeps the chain valid", async () => {
    const e1 = await emit({ type: "student.signed_up", stage: 1, actorType: "system", payload: { a: 1 } });
    const e2 = await emit({ type: "profile.updated", stage: 1, actorType: "student", payload: { b: 2 } });
    created.push(e1.id, e2.id);
    assert.equal(e1.chainHash.length, 64);
    assert.notEqual(e2.chainHash, e1.chainHash);
    assert.equal((await verifyEventChain()).ok, true);
  });

  it("blocks UPDATE and DELETE at the database layer (append-only)", async () => {
    const e = await emit({ type: "doc.requested", stage: 4, actorType: "ops" });
    created.push(e.id);
    await assert.rejects(prisma.event.update({ where: { id: e.id }, data: { stage: 9 } }));
    await assert.rejects(prisma.event.delete({ where: { id: e.id } }));
  });

  it("detects tampering via the integrity check", async () => {
    const e = await emit({ type: "payment.received", stage: 7, actorType: "finance", payload: { amount: 100 } });
    created.push(e.id);
    assert.equal((await verifyEventChain()).ok, true);

    await prisma.$executeRawUnsafe(`ALTER TABLE "Event" DISABLE TRIGGER USER`);
    try {
      await prisma.$executeRawUnsafe(`UPDATE "Event" SET payload = '{"amount": 999999}' WHERE id = $1`, e.id);
      const broken = await verifyEventChain();
      assert.equal(broken.ok, false);
      assert.equal(broken.brokenAt?.id, e.id);
      await prisma.$executeRawUnsafe(`UPDATE "Event" SET payload = '{"amount": 100}' WHERE id = $1`, e.id);
    } finally {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Event" ENABLE TRIGGER USER`);
    }
    assert.equal((await verifyEventChain()).ok, true);
  });

  it("records per-user read state in the mutable EventRead table", async () => {
    const e = await emit({ type: "message.sent", stage: 2, actorType: "counsellor" });
    created.push(e.id);
    await markEventRead("user-x", e.id);
    const read = await prisma.eventRead.findUnique({
      where: { userId_eventId: { userId: "user-x", eventId: e.id } },
    });
    assert.notEqual(read, null);
  });
});
