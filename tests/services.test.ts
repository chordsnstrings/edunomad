import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { prisma } from "../src/lib/db";
import {
  cancelServiceRequest,
  confirmServiceBooking,
  listServiceBookings,
  requestService,
} from "../src/lib/services";
import { OPERATING_TENANT_ID, TENANT_ID } from "../src/lib/tenant";

const STUDENT = "svc-test-student";
const PHONE = "+880000000svc";

describe("Stage 9 — ServiceBooking (CLAUDE.md §4 core entity)", () => {
  before(async () => {
    await prisma.serviceBooking.deleteMany({ where: { studentId: STUDENT } });
    await prisma.event.deleteMany({ where: { studentId: STUDENT } }).catch(() => {});
    await prisma.student.upsert({
      where: { id: STUDENT },
      create: { id: STUDENT, tenantId: OPERATING_TENANT_ID, phone: PHONE, fullName: "Service Test" },
      update: {},
    });
  });

  after(async () => {
    await prisma.serviceBooking.deleteMany({ where: { studentId: STUDENT } });
    await prisma.student.deleteMany({ where: { id: STUDENT } });
    await prisma.$disconnect();
  });

  it("records a request against the operating tenant", async () => {
    const r = await requestService(STUDENT, "housing", "Shared, near campus");
    assert.deepEqual(r, { ok: true, created: true });
    const [b] = await listServiceBookings(STUDENT);
    assert.equal(b.serviceType, "housing");
    assert.equal(b.status, "requested");
    assert.equal(b.tenantId, OPERATING_TENANT_ID);
  });

  it("rejects an unknown service type instead of writing a row", async () => {
    const r = await requestService(STUDENT, "yacht");
    assert.deepEqual(r, { ok: false, error: "invalid_service" });
    assert.equal((await listServiceBookings(STUDENT)).length, 1);
  });

  it("does not duplicate on a double tap", async () => {
    const r = await requestService(STUDENT, "housing");
    assert.deepEqual(r, { ok: false, error: "already_open" });
    assert.equal((await listServiceBookings(STUDENT)).length, 1);
  });

  it("reopens a cancelled request rather than creating a second row", async () => {
    await cancelServiceRequest(STUDENT, "housing");
    assert.equal((await listServiceBookings(STUDENT))[0].status, "cancelled");
    const again = await requestService(STUDENT, "housing");
    assert.deepEqual(again, { ok: true, created: false });
    const rows = await listServiceBookings(STUDENT);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].status, "requested");
  });

  it("emits the catalogued event on confirmation and refuses a second confirm", async () => {
    const [b] = await listServiceBookings(STUDENT);
    const ok = await confirmServiceBooking(b.id, "ops-user-test", undefined, { property_name: "Maple St" });
    assert.deepEqual(ok, { ok: true });

    const ev = await prisma.event.findFirst({
      where: { studentId: STUDENT, type: "housing.booked" },
      orderBy: { createdAt: "desc" },
    });
    assert.ok(ev, "housing.booked must be emitted (docs/02-events.md stage 9)");
    assert.equal(ev!.stage, 9);

    const twice = await confirmServiceBooking(b.id, "ops-user-test");
    assert.deepEqual(twice, { ok: false, error: "unavailable" });
  });
});

describe("§1.9 — every business-data entity carries tenantId", () => {
  // Reference/catalogue data is deliberately global: one shared university
  // catalogue serves every operating tenant, so it carries no owner.
  const GLOBAL = new Set([
    "SiteSettings", "CountryContact", "AdminUser", "Institution", "Programme",
    "Session", "PushSubscription", "OtpChallenge", "AuditLog", "Event", "EventRead",
    "SopArticle", "SopArticleVersion", "SopView", "Sop", "SopVersion", "Bulletin",
    "RegulatoryUpdate", "InboundEmail", "InstitutionCredential", "ApplicationDocument",
    "ComplianceSignOff", "RcicProfile", "CounsellorProfile", "Candidate",
    "TrainingSession", "TrainingLog", "ExitInterview", "OneOnOne", "TeamPost",
    "LeaveRecord", "Pip", "Incident", "QaReview", "Refund", "RegulatorNotification",
  ]);
  const CORE = [
    "Student", "Application", "Document", "VisaFile", "ServiceBooking",
    "Communication", "Commission", "Payout", "Invoice", "Payment",
    "ParentInvite", "Note", "Booking", "User", "ServicePartner",
  ];

  const schema = readFileSync("prisma/schema.prisma", "utf8");
  const models = [...schema.matchAll(/^model (\w+) \{([\s\S]*?)^\}/gm)].map((m) => ({
    name: m[1],
    body: m[2],
  }));

  it("covers each §4 core entity", () => {
    for (const name of CORE) {
      const m = models.find((x) => x.name === name);
      assert.ok(m, `${name} is a §4 core entity and must exist as a table`);
      assert.match(m!.body, /^\s*tenantId\s+String/m, `${name} must carry tenantId`);
    }
  });

  it("has no un-triaged model — new tables must be classified, not defaulted", () => {
    const untriaged = models
      .map((m) => m.name)
      .filter((n) => !GLOBAL.has(n) && !CORE.includes(n));
    assert.deepEqual(
      untriaged,
      [],
      `classify these as tenant-scoped or global: ${untriaged.join(", ")}`,
    );
  });

  it("uses one tenant-id convention, not four", () => {
    assert.equal(OPERATING_TENANT_ID, TENANT_ID.edunomad);
    assert.equal(new Set(Object.values(TENANT_ID)).size, Object.keys(TENANT_ID).length);
  });
});
