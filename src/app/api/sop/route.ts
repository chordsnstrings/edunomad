import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/current-user";
import { saveSop } from "@/lib/sop";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !["operations_team", "operations_manager"].includes(session.role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const { studentId, content } = (await req.json().catch(() => ({}))) as { studentId?: string; content?: string };
  if (!studentId) return Response.json({ error: "missing" }, { status: 400 });
  const res = await saveSop(studentId, String(content ?? ""));
  if (!res.ok) return Response.json({ error: res.error }, { status: 409 });
  return Response.json({ ok: true, score: res.score, version: res.version });
}
