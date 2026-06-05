import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/current-user";
import { saveSubscription } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const sub = body.subscription;
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return Response.json({ error: "invalid_subscription" }, { status: 400 });
  }
  await saveSubscription(session.userId, sub);
  return Response.json({ ok: true });
}
