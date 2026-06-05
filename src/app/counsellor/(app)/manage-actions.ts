"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";

async function cm() {
  const s = await getCurrentSession();
  if (!s || s.role !== "counsellor_manager") redirect("/counsellor");
  return s;
}

export async function reassignWithHandoffAction(fd: FormData) {
  const s = await cm();
  const studentId = String(fd.get("studentId"));
  const to = String(fd.get("counsellorUserId"));
  const handoff = String(fd.get("handoff") ?? "");
  await prisma.student.update({ where: { id: studentId }, data: { assignedCounsellorId: to } });
  await emit({ type: "counsellor.reassigned", stage: 2, studentId, actorType: "counsellor_manager", actorId: s.userId, visibility: { S: true, C: true, CM: true }, channels: { in_app: true }, payload: { counsellorUserId: to, handoff } });
  redirect("/counsellor/reassign");
}

export async function createPipAction(fd: FormData) {
  const s = await cm();
  await prisma.pip.create({ data: { counsellorUserId: String(fd.get("counsellorUserId")), managerUserId: s.userId, reason: String(fd.get("reason") ?? ""), checkpoints: ["Week 1", "Week 2", "Week 3", "Week 4"] as unknown as Prisma.InputJsonValue } });
  redirect("/counsellor/pips");
}

export async function saveOneOnOneAction(fd: FormData) {
  const s = await cm();
  await prisma.oneOnOne.create({ data: { counsellorUserId: String(fd.get("counsellorUserId")), managerUserId: s.userId, notes: String(fd.get("notes") ?? "") } });
  redirect("/counsellor/one-on-one");
}

export async function addCandidateAction(fd: FormData) {
  await cm();
  await prisma.candidate.create({ data: { name: String(fd.get("name") ?? "") } });
  redirect("/counsellor/hiring");
}
export async function advanceCandidateAction(fd: FormData) {
  await cm();
  await prisma.candidate.update({ where: { id: String(fd.get("id")) }, data: { stage: String(fd.get("stage")) } });
  redirect("/counsellor/hiring");
}

export async function scheduleTrainingAction(fd: FormData) {
  await cm();
  await prisma.trainingSession.create({ data: { topic: String(fd.get("topic") ?? ""), scheduledAt: new Date(String(fd.get("scheduledAt"))) } });
  redirect("/counsellor/training");
}

export async function addLeaveAction(fd: FormData) {
  await cm();
  await prisma.leaveRecord.create({ data: { counsellorUserId: String(fd.get("counsellorUserId")), fromDate: new Date(String(fd.get("from"))), toDate: new Date(String(fd.get("to"))), reason: String(fd.get("reason") ?? "") } });
  redirect("/counsellor/leave");
}
export async function setCapacityAction(fd: FormData) {
  await cm();
  await prisma.counsellorProfile.update({ where: { userId: String(fd.get("counsellorUserId")) }, data: { capacity: Number(fd.get("capacity") ?? 25) } });
  redirect("/counsellor/leave");
}

export async function addExitAction(fd: FormData) {
  await cm();
  await prisma.exitInterview.create({ data: { counsellorName: String(fd.get("name") ?? ""), reason: String(fd.get("reason") ?? ""), notes: String(fd.get("notes") ?? "") } });
  redirect("/counsellor/exits");
}

export async function postThreadAction(fd: FormData) {
  const s = await cm();
  await prisma.teamPost.create({ data: { authorUserId: s.userId, body: String(fd.get("body") ?? "") } });
  redirect("/counsellor/thread");
}
