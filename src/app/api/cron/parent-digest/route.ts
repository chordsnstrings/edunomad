import type { NextRequest } from "next/server";
import { verifySharedSecret } from "@/lib/shared-secret";
import { prisma } from "@/lib/db";
import { buildParentDigest } from "@/lib/digest";
import { sendSms } from "@/lib/sms";
import type { Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

// Parent daily WhatsApp digest. An external scheduler invokes this at 18:00
// local per corridor; secured by CRON_SECRET.
export async function POST(req: NextRequest) {
  const denied = verifySharedSecret(req, "CRON_SECRET", "x-cron-secret");
  if (denied) return denied;
  // Bounded so one run cannot grow unboundedly with the parent base.
  const invites = await prisma.parentInvite.findMany({
    where: { status: "accepted", parentUserId: { not: null } },
    take: 500,
  });
  // One query for every language instead of one per parent.
  const students = await prisma.student.findMany({
    where: { id: { in: invites.map((i) => i.studentId) } },
    select: { id: true, language: true },
  });
  const languageBy = new Map(students.map((s) => [s.id, s.language]));

  let sent = 0;
  const failed: string[] = [];
  for (const inv of invites) {
    // Isolate failures: one bad number or a transient SMS error used to abort the
    // whole run, leaving every parent after it in the list without a digest and
    // no record of where it stopped.
    try {
      const digest = await buildParentDigest(inv.studentId, (languageBy.get(inv.studentId) ?? "en") as Locale);
      if (!digest) continue;
      const res = await sendSms(inv.parentPhone, digest);
      if (res.ok) sent++;
      else failed.push(inv.id);
    } catch {
      failed.push(inv.id);
    }
  }
  return Response.json({ ok: true, parents: invites.length, sent, failed: failed.length });
}
