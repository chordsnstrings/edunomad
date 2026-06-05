import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/current-user";
import { lockSop } from "@/lib/sop";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !["operations_team", "operations_manager"].includes(session.role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const { studentId } = (await req.json().catch(() => ({}))) as { studentId?: string };
  if (!studentId) return Response.json({ error: "missing" }, { status: 400 });
  const res = await lockSop(studentId, session.userId);
  if (!res.ok) return Response.json({ error: res.error, score: res.score }, { status: 409 });
  return Response.json({ ok: true, version: res.version });
}
