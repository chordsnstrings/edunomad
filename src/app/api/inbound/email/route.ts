import type { NextRequest } from "next/server";
import { ingestInboundEmail } from "@/lib/inbound";

export const dynamic = "force-dynamic";

// Inbound email webhook (email provider → here). Secured by a shared secret
// when INBOUND_WEBHOOK_SECRET is set.
export async function POST(req: NextRequest) {
  const secret = process.env.INBOUND_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-inbound-secret") !== secret) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const { from, subject, body } = (await req.json().catch(() => ({}))) as { from?: string; subject?: string; body?: string };
  const rec = await ingestInboundEmail({ fromAddress: String(from ?? ""), subject: String(subject ?? ""), body: String(body ?? "") });
  return Response.json({ ok: true, id: rec.id, matched: !!rec.applicationId });
}
