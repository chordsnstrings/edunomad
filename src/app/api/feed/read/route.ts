import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/current-user";
import { markEventRead } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { eventId } = (await req.json().catch(() => ({}))) as { eventId?: string };
  if (eventId) await markEventRead(session.userId, eventId);
  return Response.json({ ok: true });
}
