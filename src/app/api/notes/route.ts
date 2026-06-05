import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!["counsellor", "counsellor_manager"].includes(session.role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const { studentId, body } = (await req.json().catch(() => ({}))) as { studentId?: string; body?: string };
  if (!studentId) return Response.json({ error: "missing_student" }, { status: 400 });

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return Response.json({ error: "not_found" }, { status: 404 });
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.note.upsert({
    where: { studentId_authorUserId: { studentId, authorUserId: session.userId } },
    create: { studentId, authorUserId: session.userId, body: String(body ?? "") },
    update: { body: String(body ?? "") },
  });
  return Response.json({ ok: true });
}
