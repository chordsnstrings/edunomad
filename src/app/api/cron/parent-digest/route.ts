import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { buildParentDigest } from "@/lib/digest";
import { sendSms } from "@/lib/sms";
import type { Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

// Parent daily WhatsApp digest. An external scheduler invokes this at 18:00
// local per corridor; secured by CRON_SECRET.
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("x-cron-secret") !== secret) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const invites = await prisma.parentInvite.findMany({ where: { status: "accepted", parentUserId: { not: null } } });
  let sent = 0;
  for (const inv of invites) {
    const student = await prisma.student.findUnique({ where: { id: inv.studentId }, select: { language: true } });
    const digest = await buildParentDigest(inv.studentId, (student?.language ?? "en") as Locale);
    if (digest) {
      await sendSms(inv.parentPhone, digest);
      sent++;
    }
  }
  return Response.json({ ok: true, parents: invites.length, sent });
}
