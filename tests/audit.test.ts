import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { logAudit, verifyAuditChain, exportAuditCsv, queryAuditLogs } from "../src/lib/audit";

const created: string[] = [];

async function deleteAuditBypassingTrigger(ids: string[]) {
  if (ids.length === 0) return;
  await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" DISABLE TRIGGER USER`);
  await prisma.auditLog.deleteMany({ where: { id: { in: ids } } });
  await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" ENABLE TRIGGER USER`);
}

describe("G007 — audit log + hash chain", () => {
  after(async () => {
    await deleteAuditBypassingTrigger(created);
    await prisma.$disconnect();
  });

  it("logs entries with a valid hash chain", async () => {
    const a = await logAudit({ actorUserId: "u1", action: "payment.approve", targetType: "Payment", targetId: "p1" });
    const b = await logAudit({ actorUserId: "u2", action: "visa_file.approve", targetType: "VisaFile", targetId: "v1", result: "denied", reason: "not compliance" });
    created.push(a.id, b.id);
    assert.equal(a.chainHash.length, 64);
    assert.equal((await verifyAuditChain()).ok, true);
  });

  it("blocks UPDATE and DELETE (append-only)", async () => {
    const a = await logAudit({ action: "user.delete", targetType: "User", targetId: "u9" });
    created.push(a.id);
    await assert.rejects(prisma.auditLog.update({ where: { id: a.id }, data: { action: "x" } }));
    await assert.rejects(prisma.auditLog.delete({ where: { id: a.id } }));
  });

  it("detects tampering and exports CSV with a chain proof", async () => {
    const a = await logAudit({ action: "refund.approve", targetType: "Refund", targetId: "r1" });
    created.push(a.id);

    await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" DISABLE TRIGGER USER`);
    try {
      await prisma.$executeRawUnsafe(`UPDATE "AuditLog" SET action = 'TAMPERED' WHERE id = $1`, a.id);
      const broken = await verifyAuditChain();
      assert.equal(broken.ok, false);
      assert.equal(broken.brokenAt?.id, a.id);
      await prisma.$executeRawUnsafe(`UPDATE "AuditLog" SET action = 'refund.approve' WHERE id = $1`, a.id);
    } finally {
      await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" ENABLE TRIGGER USER`);
    }

    const csv = await exportAuditCsv();
    assert.ok(csv.includes("hash-chain proof"));
    assert.ok(csv.includes("refund.approve"));
    assert.ok(csv.includes("# verified,true"));
  });

  it("returns paginated results", async () => {
    const res = await queryAuditLogs({ perPage: 2, page: 1 });
    assert.equal(res.perPage, 2);
    assert.ok(res.rows.length <= 2);
    assert.ok(res.total > 0);
  });
});
