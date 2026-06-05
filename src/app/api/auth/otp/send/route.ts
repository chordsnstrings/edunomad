import type { NextRequest } from "next/server";
import { sendOtp } from "@/lib/otp";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone ?? "").trim();
  if (!/^\+?[1-9]\d{9,14}$/.test(phone.replace(/[\s-]/g, ""))) {
    return Response.json({ error: "invalid_phone" }, { status: 400 });
  }
  const result = await sendOtp(phone);
  if (!result.ok) return Response.json({ error: result.error }, { status: 429 });
  // `code` is included only outside production (dev convenience).
  return Response.json({ ok: true, ...(result.code ? { devCode: result.code } : {}) });
}
