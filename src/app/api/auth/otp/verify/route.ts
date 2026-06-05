import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyOtp } from "@/lib/otp";
import { SESSION_COOKIE } from "@/lib/sessions";

export const dynamic = "force-dynamic";

const STATUS: Record<string, number> = { locked: 423, expired: 410, no_challenge: 404, invalid: 401 };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone ?? "").trim();
  const code = String(body.code ?? "").trim();
  if (!phone || !code) return Response.json({ error: "missing_fields" }, { status: 400 });

  const result = await verifyOtp(phone, code);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: STATUS[result.error ?? "invalid"] ?? 401 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, result.token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return Response.json({ ok: true, userId: result.userId });
}
