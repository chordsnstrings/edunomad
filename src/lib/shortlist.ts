import type { ActorType } from "@prisma/client";
import { prisma } from "./db";
import { emit } from "./events";

export const SHORTLIST_MAX = 6;

export async function getShortlist(studentId: string) {
  return prisma.application.findMany({
    where: { studentId, shortlistStatus: { in: ["draft", "locked"] } },
    orderBy: { createdAt: "asc" },
  });
}

export async function countShortlist(studentId: string) {
  return prisma.application.count({ where: { studentId, shortlistStatus: { in: ["draft", "locked"] } } });
}

export async function addToShortlist(
  studentId: string,
  programmeId: string,
  opts: { recommendedByCounsellor?: boolean; actorType?: ActorType; actorId?: string } = {},
) {
  const existing = await prisma.application.findUnique({ where: { studentId_programmeId: { studentId, programmeId } } });
  if (existing) return { ok: true as const, application: existing };
  if ((await countShortlist(studentId)) >= SHORTLIST_MAX) return { ok: false as const, error: "max_reached" };
  const prog = await prisma.programme.findUnique({ where: { id: programmeId }, select: { institutionId: true } });
  if (!prog) return { ok: false as const, error: "not_found" };

  const app = await prisma.application.create({
    data: { studentId, programmeId, institutionId: prog.institutionId, recommendedByCounsellor: !!opts.recommendedByCounsellor },
  });
  await emit({
    type: "shortlist.programme_added",
    stage: 3,
    studentId,
    applicationId: app.id,
    actorType: opts.actorType ?? "student",
    actorId: opts.actorId ?? null,
    visibility: { S: true, C: true, CM: true },
    channels: { in_app: true },
    payload: { programmeId, recommendedByCounsellor: !!opts.recommendedByCounsellor },
  });
  return { ok: true as const, application: app };
}

export async function removeFromShortlist(studentId: string, applicationId: string, actorType: ActorType = "student", actorId?: string) {
  const app = await prisma.application.findFirst({ where: { id: applicationId, studentId } });
  if (!app) return { ok: false as const, error: "not_found" };
  if (app.shortlistStatus === "locked") return { ok: false as const, error: "locked" };
  await prisma.application.delete({ where: { id: applicationId } });
  await emit({
    type: "shortlist.programme_removed",
    stage: 3,
    studentId,
    actorType,
    actorId: actorId ?? null,
    visibility: { S: true, C: true },
    channels: { in_app: true },
    payload: { programmeId: app.programmeId },
  });
  return { ok: true as const };
}

export async function setRationale(studentId: string, applicationId: string, rationale: string) {
  await prisma.application.updateMany({
    where: { id: applicationId, studentId, shortlistStatus: "draft" },
    data: { rationale },
  });
  return { ok: true as const };
}
