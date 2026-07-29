import type { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// DSAR subject-access export of a student's data (G168). Document binary is not
// included — only metadata (binary stays in object storage, signed-URL only).
export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) return new Response("Forbidden", { status: 403 });
  const studentId = req.nextUrl.searchParams.get("studentId");
  if (!studentId) return Response.json({ error: "missing" }, { status: 400 });
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return Response.json({ error: "not_found" }, { status: 404 });

  const [applications, documents, communications, invoices, events] = await Promise.all([
    prisma.application.findMany({ where: { studentId } }),
    prisma.document.findMany({ where: { studentId }, select: { documentType: true, version: true, status: true, createdAt: true } }),
    prisma.communication.findMany({ where: { studentId } }),
    prisma.invoice.findMany({ where: { studentId } }),
    prisma.event.findMany({ where: { studentId }, orderBy: { seq: "asc" } }),
  ]);

  const data = { exportedAt: new Date().toISOString(), student, applications, documents, communications, invoices, events };
  // Event.seq is a BigInt, which JSON.stringify throws on — so this endpoint
  // returned 500 for every student who had any events, i.e. always. Serialise
  // BigInt as a string so the subject actually receives their data (GDPR/DSAR).
  return new Response(JSON.stringify(data, (_k, v) => (typeof v === "bigint" ? v.toString() : v), 2), {
    headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="dsar-${studentId.slice(0, 8)}.json"` },
  });
}
