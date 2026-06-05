import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyOtp } from "@/lib/otp";
import { SESSION_COOKIE } from "@/lib/sessions";
import { detectLocale } from "@/i18n/locale";
import type { SourceCountry } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUS: Record<string, number> = { locked: 423, expired: 410, no_challenge: 404, invalid: 401 };
const LOCALE_COUNTRY: Record<string, SourceCountry> = { hi: "IN", ne: "NP", bn: "BD", en: "BD" };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone ?? "").trim();
  const code = String(body.code ?? "").trim();
  if (!phone || !code) return Response.json({ error: "missing_fields" }, { status: 400 });

  const result = await verifyOtp(phone, code);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: STATUS[result.error ?? "invalid"] ?? 401 });
  }

  const locale = await detectLocale();
  const attribution = body.attribution ?? undefined;
  await prisma.student.upsert({
    where: { phone },
    create: {
      phone,
      userId: result.userId,
      tenantId: result.userId!,
      language: locale,
      sourceCountry: LOCALE_COUNTRY[locale] ?? "BD",
      sourceAttribution: attribution,
    },
    update: { userId: result.userId, sourceAttribution: attribution },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, result.token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return Response.json({ ok: true });
}
