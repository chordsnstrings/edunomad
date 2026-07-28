import type { NextRequest } from "next/server";
import { verifySharedSecret } from "@/lib/shared-secret";
import { ingestInboundEmail } from "@/lib/inbound";

export const dynamic = "force-dynamic";

// Inbound email webhook (email provider → here). Secured by a shared secret
// when INBOUND_WEBHOOK_SECRET is set.
export async function POST(req: NextRequest) {
  const denied = verifySharedSecret(req, "INBOUND_WEBHOOK_SECRET", "x-inbound-secret");
  if (denied) return denied;
  const { from, subject, body } = (await req.json().catch(() => ({}))) as { from?: string; subject?: string; body?: string };
  const rec = await ingestInboundEmail({ fromAddress: String(from ?? ""), subject: String(subject ?? ""), body: String(body ?? "") });
  return Response.json({ ok: true, id: rec.id, matched: !!rec.applicationId });
}
