import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/current-user";
import { removeSubscription } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (body.endpoint) await removeSubscription(String(body.endpoint));
  return Response.json({ ok: true });
}
