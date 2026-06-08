// Seed a full multi-entity scenario across all 9 journey stages so every staff
// surface has realistic data and the event spine renders end-to-end.
//
// Status is event-sourced and hash-chained (CLAUDE.md §4), so events are
// appended through a faithful replica of src/lib/events.ts `emit` +
// src/lib/hashchain.ts. The replica is cross-checked against the existing
// app-emitted chain before writing, and the whole chain is re-verified after.
//
// Idempotent: skips if the primary scenario student already exists.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    for (const line of readFileSync(join(here, "..", ".env"), "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {}
}
loadEnv();
const prisma = new PrismaClient();

// ── Hash chain — mirrors src/lib/hashchain.ts + events.ts byte-for-byte ──────
function stableStringify(value) {
  if (value === null || value === undefined) return "null";
  if (value instanceof Date) return JSON.stringify(value.toISOString());
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  const keys = Object.keys(value).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
}
const sha256Hex = (s) => createHash("sha256").update(s, "utf8").digest("hex");
const GENESIS_HASH = "EDUNOMAD::GENESIS::v1";
const computeChainHash = (content, prevHash) => sha256Hex(stableStringify(content) + "||" + prevHash);
const eventContent = (e) => ({
  id: e.id, type: e.type, stage: e.stage, studentId: e.studentId,
  applicationId: e.applicationId, actorType: e.actorType, actorId: e.actorId,
  visibility: e.visibility, channels: e.channels, payload: e.payload, createdAt: e.createdAt,
});

const EVENT_LOCK = 911001;
async function emit(input) {
  const id = randomUUID();
  const createdAt = input.createdAt ?? new Date();
  const visibility = input.visibility ?? {};
  const channels = input.channels ?? { in_app: true };
  const payload = input.payload ?? {};
  const studentId = input.studentId ?? null;
  const applicationId = input.applicationId ?? null;
  const actorId = input.actorId ?? null;
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${EVENT_LOCK})`;
    const prev = await tx.event.findFirst({ orderBy: { seq: "desc" }, select: { chainHash: true } });
    const prevHash = prev?.chainHash ?? GENESIS_HASH;
    const chainHash = computeChainHash(
      eventContent({ id, type: input.type, stage: input.stage, studentId, applicationId, actorType: input.actorType, actorId, visibility, channels, payload, createdAt }),
      prevHash,
    );
    return tx.event.create({
      data: { id, type: input.type, stage: input.stage, studentId, applicationId, actorType: input.actorType, actorId, visibility, channels, payload, createdAt, chainHash },
    });
  });
}

/** Prove the replica matches the app: recompute the stored chain from GENESIS. */
async function verifyChain(label) {
  const events = await prisma.event.findMany({ orderBy: { seq: "asc" } });
  let prev = GENESIS_HASH;
  for (const e of events) {
    const expected = computeChainHash(eventContent(e), prev);
    if (expected !== e.chainHash) {
      throw new Error(`[seed-scenario] CHAIN BROKEN at seq=${e.seq} type=${e.type} (${label})`);
    }
    prev = e.chainHash;
  }
  console.log(`[seed-scenario] chain verified (${label}): ${events.length} events`);
}

const day = 864e5;
const daysAgo = (n) => new Date(Date.now() - n * day);
const VIS_ALL = { S: true, P: true, C: true, O: true, OM: true, CM: true, COMP: true, F: true, EM: true };
const CH_CRIT = { in_app: true, push: true, whatsapp: true, email: true };
const CH_IMP = { in_app: true, push: true };

async function pickProgrammes(n) {
  const progs = await prisma.programme.findMany({
    where: { institution: { country: "CA" } },
    include: { institution: true }, take: 80,
  });
  const seen = new Set(); const out = [];
  for (const p of progs) {
    if (seen.has(p.institutionId)) continue;
    seen.add(p.institutionId); out.push(p);
    if (out.length >= n) break;
  }
  return out;
}

async function makeStudent({ phone, name, email, counsellorId, completeness, leadScore }) {
  const user = await prisma.user.upsert({
    where: { phone },
    create: { phone, tenant: "student", tenantId: "student", role: "student", email, language: "en" },
    update: {},
  });
  const student = await prisma.student.create({
    data: {
      userId: user.id, tenantId: "student", phone, fullName: name, email, language: "en",
      sourceCountry: "BD", dateOfBirth: new Date("2002-05-14"),
      academic: { level: "bachelor", percentage: 78, board: "National University", gradYear: 2024 },
      englishProficiency: { status: "have", test: "IELTS", overall: 7.0, listening: 7.5, reading: 7.0, writing: 6.5, speaking: 7.0 },
      destinations: ["CA"], fieldOfStudy: "Computer Science", fieldCategory: "computing",
      budgetMinUsd: 15000, budgetMaxUsd: 30000, fundingSource: "family",
      intakeTarget: { month: 9, year: 2026 },
      completenessPct: completeness, assignedCounsellorId: counsellorId, leadScore,
    },
  });
  return { user, student };
}

async function main() {
  const PRIMARY_PHONE = "+8801712345001";
  if (await prisma.student.findUnique({ where: { phone: PRIMARY_PHONE } })) {
    console.log("[seed-scenario] already populated");
    return;
  }
  await verifyChain("pre-seed (app-emitted)");

  const byPhone = (p) => prisma.user.findUnique({ where: { phone: p } });
  const asha = await byPhone("+8801000000001");
  const opsTeam = await byPhone("+8801000000011");
  const opsMgr = await byPhone("+8801000000010");
  const compliance = await byPhone("+8801000000020");
  const finance = await byPhone("+8801000000030");
  if (!asha || !opsTeam || !compliance || !finance) {
    throw new Error("[seed-scenario] staff missing — run seed-team.mjs + seed-ops.mjs first");
  }
  if (compliance) {
    await prisma.rcicProfile.upsert({
      where: { userId: compliance.id },
      create: { userId: compliance.id, registrationBody: "CICC", registrationNumber: "R712345", validUntil: daysAgo(-540) },
      update: {},
    });
  }
  const progs = await pickProgrammes(4);
  if (progs.length < 4) throw new Error("[seed-scenario] need catalog — run seed-catalog.mjs first");

  // ── PRIMARY: Rahim — complete journey to visa APPROVED + pre-departure ──────
  const { user: rahimUser, student: rahim } = await makeStudent({
    phone: PRIMARY_PHONE, name: "Rahim Chowdhury", email: "rahim.c@example.com",
    counsellorId: asha.id, completeness: 100, leadScore: 88,
  });
  const sid = rahim.id;
  const uname = (p) => p.institution.name;

  await prisma.note.create({ data: { studentId: sid, authorUserId: asha.id, body: "Strong profile, IELTS 7.0, family-funded. Targeting Sept 2026 CS master's in Canada. Parent (father) is the sponsor — invited and active." } });
  await prisma.booking.create({ data: { studentId: sid, counsellorUserId: asha.id, startsAt: daysAgo(110), durationMin: 45, status: "completed", rescheduleToken: randomUUID() } });
  await prisma.communication.createMany({ data: [
    { studentId: sid, userId: asha.id, type: "call", direction: "outbound", content: "Onboarding call — discussed shortlist strategy and GIC pathway.", transcript: "Counsellor reviewed eligibility and agreed on 3 target programmes.", language: "en", createdAt: daysAgo(110) },
    { studentId: sid, userId: asha.id, type: "whatsapp", direction: "outbound", content: "Hi Rahim, sharing your shortlist. Please review and lock when ready.", language: "en", createdAt: daysAgo(108) },
    { studentId: sid, type: "email", direction: "inbound", content: `Offer of Admission — ${uname(progs[0])}`, language: "en", createdAt: daysAgo(60) },
  ] });
  await prisma.sop.create({ data: { studentId: sid, content: "Statement of Purpose — Rahim Chowdhury. My objective is to pursue an MSc in Computer Science...", version: 2, status: "locked", plagiarismScore: 3.2 } });

  // Applications (3): offer on the first; others submitted/under review.
  const apps = [];
  for (let i = 0; i < 3; i++) {
    const p = progs[i];
    const offered = i === 0;
    const a = await prisma.application.create({
      data: {
        studentId: sid, programmeId: p.id, institutionId: p.institutionId,
        shortlistStatus: "locked", recommendedByCounsellor: true, bucket: i === 0 ? "reach" : i === 1 ? "match" : "safe",
        rationale: "Aligned with field, budget and intake.",
        submissionStatus: offered ? "offer_unconditional" : "under_review",
        submissionMethod: "portal", referenceId: `APP-${1000 + i}`, submittedAt: daysAgo(78),
        decisionStatus: offered ? "offer" : null, decisionAt: offered ? daysAgo(60) : null,
        offerUrl: offered ? "https://example.edu/offer/APP-1000.pdf" : null,
        conditions: offered ? { english: "met", deposit: "CAD 10000 tuition deposit" } : undefined,
        opsApproved: true,
      },
    });
    apps.push(a);
  }
  const offeredApp = apps[0];

  // Documents (approved) + packaged into the offered application.
  const DOCS = [
    { type: "passport", role: "identity" },
    { type: "academic_transcript", role: "academic" },
    { type: "ielts", role: "english" },
    { type: "sop", role: "sop" },
    { type: "financial_statement", role: "funding" },
  ];
  for (const d of DOCS) {
    const doc = await prisma.document.create({
      data: {
        studentId: sid, documentType: d.type, version: 1,
        storageKey: `scenario/${sid}/${d.type}.pdf`, mimeType: "application/pdf", sizeBytes: 480000,
        status: "approved", uploadedBy: rahimUser.id, reviewedBy: opsTeam.id, reviewedAt: daysAgo(86),
        qaResults: { checks: ["legible", "valid", "matches_profile"], passed: true },
      },
    });
    await prisma.applicationDocument.create({ data: { applicationId: offeredApp.id, documentId: doc.id, roleInApp: d.role } });
  }

  // Parent invite (accepted) + parent user.
  const parentUser = await prisma.user.upsert({
    where: { phone: "+8801712345101" },
    create: { phone: "+8801712345101", tenant: "student", tenantId: "student", role: "parent", language: "bn" },
    update: {},
  });
  await prisma.parentInvite.create({ data: { studentId: sid, parentPhone: "+8801712345101", pinHash: "seed-pin-hash", status: "accepted", parentUserId: parentUser.id, sentAt: daysAgo(105), acceptedAt: daysAgo(104) } });

  // Invoices + payments (service fee + tuition deposit + GIC), finance-approved.
  for (const inv of [
    { purpose: "service_fee", local: 25000, usd: 210 },
    { purpose: "tuition_deposit", local: 880000, usd: 7350 },
    { purpose: "gic_referral", local: 5000, usd: 42 },
  ]) {
    const invoice = await prisma.invoice.create({ data: { studentId: sid, amountLocal: inv.local, currency: "BDT", amountUsd: inv.usd, purpose: inv.purpose, status: "paid", dueDate: daysAgo(58), createdAt: daysAgo(62) } });
    await prisma.payment.create({ data: { invoiceId: invoice.id, amountLocal: inv.local, currency: "BDT", method: "bkash", externalRef: `TXN-${Math.floor(Math.random() * 1e9)}`, status: "succeeded", approvedByUserId: finance.id, processedAt: daysAgo(54) } });
  }

  // Visa file — signed off + submitted + APPROVED.
  const visa = await prisma.visaFile.create({
    data: {
      applicationId: offeredApp.id, studentId: sid, destinationCountry: "CA",
      checklistState: { passport: "ok", loa: "ok", gic: "ok", tuition: "ok", sop: "ok", funds: "ok" },
      completenessPct: 100, prepStartedAt: daysAgo(45), readyForSignoffAt: daysAgo(38),
      signedOffAt: daysAgo(35), signedOffBy: compliance.id, registrationNumber: "R712345",
      versionHash: sha256Hex("visa-" + offeredApp.id).slice(0, 32),
      submittedAt: daysAgo(33), submissionProof: { authority: "IRCC", confirmation: "IRCC-CONF-88421" },
      decisionStatus: "approved", decisionAt: daysAgo(7),
      biometricsDoneAt: daysAgo(20), vfsAppointmentAt: daysAgo(22), passportReturnedAt: daysAgo(5),
    },
  });
  await prisma.complianceSignOff.create({ data: { visaFileId: visa.id, complianceUserId: compliance.id, registrationNumber: "R712345", versionHash: visa.versionHash, createdAt: daysAgo(35) } });

  // Commission on the offered application — received, ready to pay out (W4 finance).
  {
    const inst = progs[0].institution;
    const ratePct = inst.commissionRateMinPct;
    const usd = Math.round((progs[0].tuitionPerYearUsd * ratePct) / 100);
    await prisma.commission.create({
      data: { applicationId: offeredApp.id, institutionId: inst.id, studentId: sid, ratePct, amount: Math.round(usd / 0.73), currency: "CAD", amountUsd: usd, status: "received", expectedAt: daysAgo(60), receivedAt: daysAgo(20), reference: "UNI-INV-0001" },
    });
  }

  // Event spine for Rahim (chronological → seq order).
  const E = [];
  E.push(["profile.completed", 1, "student", rahimUser.id, { completeness: 100 }, { S: true, C: true }, CH_IMP, 118, null]);
  E.push(["eligibility.checked", 1, "student", rahimUser.id, { matches: 12 }, { S: true, C: true }, { in_app: true }, 117, null]);
  E.push(["counsellor.assigned", 2, "system", null, { counsellor: "Asha Rahman" }, { S: true, C: true, CM: true }, CH_IMP, 115, null]);
  E.push(["call.booked", 2, "counsellor", asha.id, { startsAt: daysAgo(110).toISOString() }, { S: true, C: true }, CH_IMP, 112, null]);
  E.push(["counsellor.call_completed", 2, "counsellor", asha.id, { counsellor: "Asha Rahman", durationMin: 45 }, { S: true, C: true, CM: true }, { in_app: true }, 110, null]);
  E.push(["counsellor.message_sent", 2, "counsellor", asha.id, { counsellor: "Asha Rahman", preview: "Sharing your shortlist…" }, { S: true, C: true }, CH_IMP, 108, null]);
  E.push(["parent.invited", 2, "student", rahimUser.id, { parentPhone: "+88017*****101" }, { S: true, C: true }, CH_IMP, 105, null]);
  E.push(["parent.joined", 2, "parent", parentUser.id, {}, { S: true, P: true, C: true }, CH_IMP, 104, null]);
  for (let i = 0; i < 3; i++) E.push(["shortlist.programme_added", 3, "counsellor", asha.id, { university: uname(progs[i]) }, { S: true, C: true }, { in_app: true }, 100 - i, null]);
  E.push(["shortlist.locked", 3, "student", rahimUser.id, { count: 3 }, { S: true, C: true, O: true }, CH_IMP, 98, null]);
  E.push(["document_checklist.generated", 4, "system", null, { items: DOCS.length }, { S: true, O: true }, { in_app: true }, 96, null]);
  for (const d of DOCS) E.push(["document.uploaded", 4, "student", rahimUser.id, { document_type: d.type }, { S: true, O: true }, { in_app: true }, 92, null]);
  for (const d of DOCS) E.push(["document.approved", 4, "ops", opsTeam.id, { document_type: d.type }, { S: true, O: true }, CH_IMP, 86, null]);
  E.push(["sop.locked", 4, "student", rahimUser.id, {}, { S: true, C: true, O: true }, { in_app: true }, 84, null]);
  E.push(["application.approved", 4, "ops", opsTeam.id, { university: uname(progs[0]) }, { S: true, O: true, OM: true }, { in_app: true }, 80, offeredApp.id]);
  for (let i = 0; i < 3; i++) E.push(["application.submitted", 5, "ops", opsTeam.id, { university: uname(progs[i]) }, VIS_ALL, CH_IMP, 78, apps[i].id]);
  E.push(["offer.received", 6, "university", null, { university: uname(progs[0]) }, VIS_ALL, CH_CRIT, 60, offeredApp.id]);
  E.push(["payment.received", 7, "finance", finance.id, { amount: "25,000", currency: "BDT", purpose: "service_fee" }, { S: true, P: true, F: true }, CH_CRIT, 54, null]);
  E.push(["payment.received", 7, "finance", finance.id, { amount: "880,000", currency: "BDT", purpose: "tuition_deposit" }, { S: true, P: true, F: true }, CH_CRIT, 53, offeredApp.id]);
  E.push(["visa.file_created", 8, "ops", opsTeam.id, {}, { S: true, O: true, COMP: true }, { in_app: true }, 45, offeredApp.id]);
  E.push(["visa.pre_compliance_audited", 8, "ops_manager", opsMgr ? opsMgr.id : opsTeam.id, { passed: true }, { O: true, OM: true, COMP: true }, { in_app: true }, 40, offeredApp.id]);
  E.push(["visa.ready_for_signoff", 8, "ops", opsTeam.id, {}, { O: true, COMP: true }, CH_IMP, 38, offeredApp.id]);
  E.push(["visa.signed_off", 8, "compliance", compliance.id, { registrationNumber: "R712345" }, VIS_ALL, CH_IMP, 35, offeredApp.id]);
  E.push(["visa.submitted", 8, "ops", opsTeam.id, { authority: "IRCC" }, VIS_ALL, CH_CRIT, 33, offeredApp.id]);
  E.push(["visa.appointment_booked", 8, "ops", opsTeam.id, { location: "VFS Dhaka", datetime: daysAgo(22).toISOString() }, { S: true, P: true, O: true }, CH_CRIT, 24, offeredApp.id]);
  E.push(["visa.approved", 9, "system", null, { university: uname(progs[0]) }, VIS_ALL, CH_CRIT, 7, offeredApp.id]);
  for (const [type, stage, actorType, actorId, payload, visibility, channels, dago, applicationId] of E) {
    await emit({ type, stage, studentId: sid, applicationId, actorType, actorId, payload, visibility, channels, createdAt: daysAgo(dago) });
  }

  // ── SECONDARY students to populate each staff queue ─────────────────────────
  // Karim — visa file READY FOR SIGNOFF (compliance queue item).
  {
    const { user, student } = await makeStudent({ phone: "+8801712345002", name: "Karim Uddin", email: "karim.u@example.com", counsellorId: asha.id, completeness: 100, leadScore: 80 });
    const p = progs[1];
    const a = await prisma.application.create({ data: { studentId: student.id, programmeId: p.id, institutionId: p.institutionId, shortlistStatus: "locked", recommendedByCounsellor: true, submissionStatus: "offer_unconditional", submissionMethod: "portal", referenceId: "APP-2001", submittedAt: daysAgo(30), decisionStatus: "offer", decisionAt: daysAgo(14), offerUrl: "https://example.edu/offer/APP-2001.pdf", opsApproved: true } });
    await prisma.visaFile.create({ data: { applicationId: a.id, studentId: student.id, destinationCountry: "CA", checklistState: { passport: "ok", loa: "ok", gic: "ok", tuition: "ok", sop: "ok", funds: "ok" }, completenessPct: 100, prepStartedAt: daysAgo(10), readyForSignoffAt: daysAgo(2), decisionStatus: "pending" } });
    {
      const ratePct = p.institution.commissionRateMinPct;
      const usd = Math.round((p.tuitionPerYearUsd * ratePct) / 100);
      await prisma.commission.create({ data: { applicationId: a.id, institutionId: p.institutionId, studentId: student.id, ratePct, amount: Math.round(usd / 0.73), currency: "CAD", amountUsd: usd, status: "expected", expectedAt: daysAgo(14) } });
    }
    for (const d of ["passport", "academic_transcript", "ielts", "financial_statement"]) {
      await prisma.document.create({ data: { studentId: student.id, documentType: d, storageKey: `scenario/${student.id}/${d}.pdf`, mimeType: "application/pdf", sizeBytes: 410000, status: "approved", uploadedBy: user.id, reviewedBy: opsTeam.id, reviewedAt: daysAgo(5) } });
    }
    await emit({ type: "counsellor.assigned", stage: 2, studentId: student.id, actorType: "system", payload: { counsellor: "Asha Rahman" }, visibility: { S: true, C: true }, channels: CH_IMP, createdAt: daysAgo(40) });
    await emit({ type: "application.submitted", stage: 5, studentId: student.id, applicationId: a.id, actorType: "ops", actorId: opsTeam.id, payload: { university: uname(p) }, visibility: VIS_ALL, channels: CH_IMP, createdAt: daysAgo(30) });
    await emit({ type: "offer.received", stage: 6, studentId: student.id, applicationId: a.id, actorType: "university", payload: { university: uname(p) }, visibility: VIS_ALL, channels: CH_CRIT, createdAt: daysAgo(14) });
    await emit({ type: "visa.ready_for_signoff", stage: 8, studentId: student.id, applicationId: a.id, actorType: "ops", actorId: opsTeam.id, payload: {}, visibility: { O: true, COMP: true }, channels: CH_IMP, createdAt: daysAgo(2) });
  }

  // Sumi — document QA / packaging stage (operations queue items).
  {
    const { user, student } = await makeStudent({ phone: "+8801712345003", name: "Sumaiya Akter", email: "sumi.a@example.com", counsellorId: asha.id, completeness: 90, leadScore: 72 });
    const p = progs[2];
    const a = await prisma.application.create({ data: { studentId: student.id, programmeId: p.id, institutionId: p.institutionId, shortlistStatus: "locked", recommendedByCounsellor: true, submissionStatus: "packaged", submissionMethod: "portal", opsApproved: false } });
    for (const d of ["passport", "academic_transcript", "ielts"]) {
      const doc = await prisma.document.create({ data: { studentId: student.id, documentType: d, storageKey: `scenario/${student.id}/${d}.pdf`, mimeType: "application/pdf", sizeBytes: 390000, status: "under_review", uploadedBy: user.id } });
      await prisma.applicationDocument.create({ data: { applicationId: a.id, documentId: doc.id, roleInApp: d } });
    }
    await emit({ type: "counsellor.assigned", stage: 2, studentId: student.id, actorType: "system", payload: { counsellor: "Asha Rahman" }, visibility: { S: true, C: true }, channels: CH_IMP, createdAt: daysAgo(20) });
    await emit({ type: "shortlist.locked", stage: 3, studentId: student.id, actorType: "student", actorId: user.id, payload: { count: 1 }, visibility: { S: true, C: true, O: true }, channels: CH_IMP, createdAt: daysAgo(12) });
    await emit({ type: "document.uploaded", stage: 4, studentId: student.id, actorType: "student", actorId: user.id, payload: { document_type: "ielts" }, visibility: { S: true, O: true }, channels: { in_app: true }, createdAt: daysAgo(3) });
  }

  // Fatima — fresh lead to qualify (counsellor inbox item).
  {
    const { user, student } = await makeStudent({ phone: "+8801712345004", name: "Fatima Begum", email: "fatima.b@example.com", counsellorId: asha.id, completeness: 55, leadScore: 41 });
    const p = progs[3];
    await prisma.application.create({ data: { studentId: student.id, programmeId: p.id, institutionId: p.institutionId, shortlistStatus: "draft", recommendedByCounsellor: false } });
    await emit({ type: "eligibility.checked", stage: 1, studentId: student.id, actorType: "student", actorId: user.id, payload: { matches: 8 }, visibility: { S: true, C: true }, channels: { in_app: true }, createdAt: daysAgo(4) });
    await emit({ type: "counsellor.assigned", stage: 2, studentId: student.id, actorType: "system", payload: { counsellor: "Asha Rahman" }, visibility: { S: true, C: true }, channels: CH_IMP, createdAt: daysAgo(3) });
  }

  await verifyChain("post-seed (full)");
  const counts = {
    students: await prisma.student.count(),
    applications: await prisma.application.count(),
    documents: await prisma.document.count(),
    visaFiles: await prisma.visaFile.count(),
    invoices: await prisma.invoice.count(),
    payments: await prisma.payment.count(),
    events: await prisma.event.count(),
  };
  console.log("[seed-scenario] created:", JSON.stringify(counts));
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
