import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { getPresignedPutUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "student") return Response.json({ error: "unauthorized" }, { status: 401 });
  const student = await getMyStudent(session.userId);
  if (!student) return Response.json({ error: "no_student" }, { status: 404 });

  const { documentType, contentType } = (await req.json().catch(() => ({}))) as { documentType?: string; contentType?: string };
  if (!documentType) return Response.json({ error: "missing" }, { status: 400 });

  const ext = (contentType ?? "").includes("pdf") ? "pdf" : (contentType ?? "").includes("png") ? "png" : "jpg";
  const storageKey = `documents/${student.id}/${documentType}/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const url = await getPresignedPutUrl(storageKey, contentType || "application/octet-stream");
  return Response.json({ url, storageKey });
}
