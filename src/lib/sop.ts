import { prisma } from "./db";
import { emit } from "./events";
import { logAudit } from "./audit";
import { checkPlagiarism, PLAGIARISM_THRESHOLD } from "./sop-polish";

export async function getOrCreateSop(studentId: string) {
  return (await prisma.sop.findUnique({ where: { studentId } })) ?? prisma.sop.create({ data: { studentId } });
}

/** Save a new version of the SOP draft (blocked once locked). */
export async function saveSop(studentId: string, content: string) {
  const sop = await getOrCreateSop(studentId);
  if (sop.status === "locked") return { ok: false as const, error: "locked" };
  const score = checkPlagiarism(content);
  const updated = await prisma.sop.update({
    where: { id: sop.id },
    data: { content, plagiarismScore: score, version: sop.version + 1, status: "polished" },
  });
  await prisma.sopVersion.create({ data: { sopId: sop.id, version: updated.version, content } });
  return { ok: true as const, score, version: updated.version };
}

/** A statement of purpose shorter than this is not a submission. */
const MIN_SOP_CHARS = 200;

/** Lock the SOP — gated on plagiarism < threshold; audited; emits sop.locked. */
export async function lockSop(studentId: string, actorUserId: string) {
  const sop = await getOrCreateSop(studentId);
  // An empty or near-empty SOP scores 0 on the plagiarism check, so the gate
  // passed it straight through and locked a blank statement of purpose.
  if (sop.content.trim().length < MIN_SOP_CHARS) {
    return { ok: false as const, error: "too_short" as const, score: 0 };
  }
  const score = checkPlagiarism(sop.content);
  if (score > PLAGIARISM_THRESHOLD) return { ok: false as const, error: "plagiarism", score };
  const updated = await prisma.sop.update({ where: { id: sop.id }, data: { status: "locked" } });
  await prisma.sopVersion.create({ data: { sopId: sop.id, version: updated.version, content: sop.content, lockedBy: actorUserId } });
  await emit({
    type: "sop.locked",
    stage: 4,
    studentId,
    actorType: "ops",
    actorId: actorUserId,
    visibility: { S: true, C: true, O: true },
    channels: { in_app: true },
    payload: { version: updated.version },
  });
  await logAudit({ actorUserId, action: "sop.locked", targetType: "Sop", targetId: sop.id, result: "success", reason: `v${updated.version}` });
  return { ok: true as const, version: updated.version };
}

export async function getSopVersions(sopId: string) {
  return prisma.sopVersion.findMany({ where: { sopId }, orderBy: { version: "desc" } });
}
