import type { NextRequest } from "next/server";
import { sendOtp } from "@/lib/otp";
import { otpSendLimit, tooManyResponse } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone ?? "").trim();
  if (!/^\+?[1-9]\d{9,14}$/.test(phone.replace(/[\s-]/g, ""))) {
    return Response.json({ error: "invalid_phone" }, { status: 400 });
  }
  // Rate limit: 3 sends / hour / phone (mirrors the DB window in lib/otp.ts),
  // returning a proper Retry-After before any DB work (CLAUDE.md §11).
  const limit = otpSendLimit(phone);
  if (!limit.ok) return tooManyResponse(limit);
  const result = await sendOtp(phone);
  if (!result.ok) return Response.json({ error: result.error }, { status: 429 });
  // `code` is included only outside production (dev convenience).
  return Response.json({ ok: true, ...(result.code ? { devCode: result.code } : {}) });
}
