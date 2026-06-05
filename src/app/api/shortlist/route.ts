import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { addToShortlist, removeFromShortlist, setRationale } from "@/lib/shortlist";

export const dynamic = "force-dynamic";

async function student() {
  const session = await getCurrentSession();
  if (!session || session.role !== "student") return null;
  return getMyStudent(session.userId);
}

export async function POST(req: NextRequest) {
  const s = await student();
  if (!s) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { programmeId } = (await req.json().catch(() => ({}))) as { programmeId?: string };
  if (!programmeId) return Response.json({ error: "missing" }, { status: 400 });
  const res = await addToShortlist(s.id, programmeId);
  if (!res.ok) return Response.json({ error: res.error }, { status: res.error === "max_reached" ? 409 : 400 });
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const s = await student();
  if (!s) return Response.json({ error: "unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return Response.json({ error: "missing" }, { status: 400 });
  const res = await removeFromShortlist(s.id, id);
  if (!res.ok) return Response.json({ error: res.error }, { status: 400 });
  return Response.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const s = await student();
  if (!s) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { applicationId, rationale } = (await req.json().catch(() => ({}))) as { applicationId?: string; rationale?: string };
  if (!applicationId) return Response.json({ error: "missing" }, { status: 400 });
  await setRationale(s.id, applicationId, String(rationale ?? ""));
  return Response.json({ ok: true });
}
