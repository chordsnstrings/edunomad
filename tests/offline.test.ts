import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { resolveLww, applyLwwWithAudit } from "../src/lib/offline/conflict";
import { MemoryQueueStore, enqueueRequest, flushQueue } from "../src/lib/offline/syncQueue";

describe("G016 — offline sync queue + LWW conflict resolution", () => {
  after(async () => {
    await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" DISABLE TRIGGER USER`);
    await prisma.auditLog.deleteMany({ where: { targetId: { startsWith: "lww-test-" } } });
    await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" ENABLE TRIGGER USER`);
    await prisma.$disconnect();
  });

  it("queues requests and flushes them on reconnect", async () => {
    const store = new MemoryQueueStore();
    await enqueueRequest(store, { url: "/api/profile", method: "PATCH", body: "{}" });
    await enqueueRequest(store, { url: "/api/profile", method: "PATCH", body: "{}" });
    assert.equal((await store.all()).length, 2);
    const res = await flushQueue(store, async () => ({ ok: true }));
    assert.equal(res.synced, 2);
    assert.equal((await store.all()).length, 0);
  });

  it("keeps requests that fail to sync", async () => {
    const store = new MemoryQueueStore();
    await enqueueRequest(store, { url: "/api/x", method: "POST" });
    const res = await flushQueue(store, async () => ({ ok: false }));
    assert.equal(res.failed, 1);
    assert.equal((await store.all()).length, 1);
  });

  it("resolves last-write-wins", () => {
    assert.deepEqual(resolveLww(100, 200), { winner: "client", conflict: false });
    assert.deepEqual(resolveLww(200, 100), { winner: "server", conflict: true });
  });

  it("applies the client write when newer (no conflict)", async () => {
    let applied = false;
    const r = await applyLwwWithAudit({
      serverUpdatedAt: 100,
      clientUpdatedAt: 200,
      targetType: "Student",
      targetId: "lww-test-1",
      apply: async () => {
        applied = true;
      },
    });
    assert.equal(applied, true);
    assert.equal(r.conflict, false);
  });

  it("logs an audit note on conflict and skips the stale write", async () => {
    let applied = false;
    const r = await applyLwwWithAudit({
      serverUpdatedAt: 200,
      clientUpdatedAt: 100,
      targetType: "Student",
      targetId: "lww-test-2",
      apply: async () => {
        applied = true;
      },
    });
    assert.equal(applied, false);
    assert.equal(r.conflict, true);
    const audit = await prisma.auditLog.findFirst({
      where: { targetId: "lww-test-2", action: "sync.conflict" },
    });
    assert.notEqual(audit, null);
  });
});
