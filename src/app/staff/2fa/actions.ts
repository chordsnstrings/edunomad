"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/current-user";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/ratelimit";
import { text } from "@/lib/form";
import {
  beginStaffEnrollment,
  confirmStaffEnrollment,
  markSessionTwoFactor,
  twoFactorAvailable,
  verifyStaffTwoFactor,
} from "@/lib/staff-2fa";
import { prisma } from "@/lib/db";

async function staff() {
  const s = await getCurrentSession();
  if (!s || !twoFactorAvailable(s.role)) redirect("/");
  return s;
}

/** Start enrolment and stash the one-time secret for the page to display. */
export async function beginEnrollmentAction(formData: FormData) {
  const s = await staff();
  const next = text(formData, "next", 200) || "/";
  const user = await prisma.user.findUnique({ where: { id: s.userId }, select: { phone: true, email: true } });
  const { secret } = await beginStaffEnrollment(s.userId, user?.email ?? user?.phone ?? s.userId);
  // The secret is shown once, in the URL of a same-session redirect, never
  // persisted anywhere a later reader could find it.
  redirect(`/staff/2fa?next=${encodeURIComponent(next)}&setup=${encodeURIComponent(secret)}`);
}

export async function confirmEnrollmentAction(formData: FormData) {
  const s = await staff();
  const next = text(formData, "next", 200) || "/";
  const code = text(formData, "code", 12);

  // Confirmation is a code-guessing surface like any other; without a limit it
  // is a 6-digit oracle against a known secret.
  const limit = rateLimit(`staff:2fa:enrol:${s.userId}`, 10, 15 * 60 * 1000);
  if (!limit.ok) redirect(`/staff/2fa?next=${encodeURIComponent(next)}&error=rate_limited`);

  if (!(await confirmStaffEnrollment(s.userId, code))) {
    redirect(`/staff/2fa?next=${encodeURIComponent(next)}&error=invalid`);
  }
  await markSessionTwoFactor(s.id);
  redirect(next);
}

export async function verifyChallengeAction(formData: FormData) {
  const s = await staff();
  const next = text(formData, "next", 200) || "/";
  const code = text(formData, "code", 32);

  const limit = rateLimit(`staff:2fa:verify:${s.userId}`, 10, 15 * 60 * 1000);
  if (!limit.ok) redirect(`/staff/2fa?next=${encodeURIComponent(next)}&error=rate_limited`);

  if (!(await verifyStaffTwoFactor(s.userId, code))) {
    await logAudit({
      actorUserId: s.userId,
      action: "two_factor.failed",
      targetType: "User",
      targetId: s.userId,
      result: "denied",
      reason: "invalid second factor",
    });
    redirect(`/staff/2fa?next=${encodeURIComponent(next)}&error=invalid`);
  }
  await markSessionTwoFactor(s.id);
  redirect(next);
}
