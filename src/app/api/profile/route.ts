import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { computeCompleteness, PROFILE_WRITABLE } from "@/lib/student";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  for (const key of PROFILE_WRITABLE) {
    if (key in body) data[key] = body[key];
  }
  if ("dateOfBirth" in data && data.dateOfBirth) {
    data.dateOfBirth = new Date(String(data.dateOfBirth));
  }

  const student = await prisma.student.findFirst({ where: { userId: session.userId } });
  if (!student) return Response.json({ error: "no_student" }, { status: 404 });

  const merged = { ...student, ...data } as Record<string, unknown>;
  const completenessPct = computeCompleteness(merged);

  await prisma.student.update({
    where: { id: student.id },
    data: { ...(data as Prisma.StudentUpdateInput), completenessPct },
  });
  return Response.json({ ok: true, completenessPct });
}
