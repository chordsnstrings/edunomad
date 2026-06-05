import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { authorize, can, type AuthUser } from "../src/lib/rbac";

const compliance: AuthUser = { id: "comp-1", role: "compliance", tenant: "edunomad", tenantId: "edu" };
const counsellor: AuthUser = { id: "couns-1", role: "counsellor", tenant: "edunomad", tenantId: "edu" };
const finance: AuthUser = { id: "fin-1", role: "finance", tenant: "edunomad", tenantId: "edu" };
const student: AuthUser = { id: "stu-1", role: "student", tenant: "student", tenantId: "stu" };
const superAdmin: AuthUser = { id: "sa-1", role: "super_admin", tenant: "edunomad", tenantId: "edu" };

describe("G006 — RBAC server-side enforcement", () => {
  after(async () => {
    await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" DISABLE TRIGGER USER`);
    await prisma.auditLog.deleteMany({ where: { targetId: { startsWith: "rbac-test-" } } });
    await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" ENABLE TRIGGER USER`);
    await prisma.$disconnect();
  });

  it("denies by default for unknown tuples", () => {
    assert.equal(can({ user: counsellor, entity: "nonsense", action: "view" }).allowed, false);
    assert.equal(can({ user: counsellor, entity: "payment", action: "approve" }).allowed, false);
  });

  it("enforces sole compliance sign-off on visa files", async () => {
    assert.equal(await authorize({ user: compliance, entity: "visa_file", action: "approve", target: { id: "rbac-test-vf1" } }), true);
    assert.equal(await authorize({ user: counsellor, entity: "visa_file", action: "approve", target: { id: "rbac-test-vf2" } }), false);
  });

  it("resolves own_assigned scope", () => {
    assert.equal(can({ user: counsellor, entity: "student", action: "edit", target: { assignedToId: "couns-1" } }).allowed, true);
    assert.equal(can({ user: counsellor, entity: "student", action: "edit", target: { assignedToId: "someone-else" } }).allowed, false);
  });

  it("resolves own_pre_lock (blocks edits after lock)", () => {
    assert.equal(can({ user: student, entity: "shortlist", action: "edit", target: { ownerId: "stu-1", locked: false } }).allowed, true);
    assert.equal(can({ user: student, entity: "shortlist", action: "edit", target: { ownerId: "stu-1", locked: true } }).allowed, false);
  });

  it("requires explicit allow for cross-tenant access", () => {
    const target = { id: "rbac-test-x", tenantId: "other-tenant" };
    assert.equal(can({ user: superAdmin, entity: "student", action: "view", target }).allowed, false);
    assert.equal(can({ user: superAdmin, entity: "student", action: "view", target, crossTenant: true }).allowed, true);
  });

  it("logs denials to the audit log", async () => {
    await authorize({ user: counsellor, entity: "payment", action: "approve", target: { id: "rbac-test-deny1" } });
    const row = await prisma.auditLog.findFirst({ where: { targetId: "rbac-test-deny1" } });
    assert.equal(row?.result, "denied");
  });

  it("logs privileged actions even when allowed", async () => {
    await authorize({ user: finance, entity: "payment", action: "approve", target: { id: "rbac-test-allow1" } });
    const row = await prisma.auditLog.findFirst({ where: { targetId: "rbac-test-allow1" } });
    assert.equal(row?.result, "success");
    assert.equal(row?.reason, "privileged action");
  });
});
