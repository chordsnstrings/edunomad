"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/require-staff";
import { createBooking } from "@/lib/booking";
import { emit } from "@/lib/events";
import { whatsappSend } from "@/lib/whatsapp";
import { sendEmail } from "@/lib/email";

export async function createBookingAction(formData: FormData) {
  // Authorisation, not just authentication: this action books a call, writes to
  // the event chain and sends the student a WhatsApp + email. Previously any
  // signed-in user could invoke it for any studentId.
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const studentId = String(formData.get("studentId") ?? "");
  const startsAt = String(formData.get("startsAt") ?? "");
  const durationMin = Number(formData.get("durationMin") ?? 45);
  if (!studentId || !startsAt) redirect("/counsellor");

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) redirect("/counsellor");
  // Counsellors may only act on their own assigned students (CLAUDE.md §6).
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) {
    redirect("/counsellor");
  }

  const booking = await createBooking(studentId, session.userId, startsAt, durationMin);
  const when = new Date(startsAt);
  const firstName = (student.fullName ?? "").split(" ")[0] || "there";

  await emit({
    type: "call.booked",
    stage: 2,
    studentId,
    actorType: "counsellor",
    actorId: session.userId,
    visibility: { S: true, C: true, CM: true },
    channels: { in_app: true, whatsapp: true, email: true },
    payload: { startsAt, durationMin, rescheduleToken: booking.rescheduleToken },
  });

  // Best-effort notifications (mocked in dev).
  try {
    await whatsappSend("call_scheduled", [firstName, when.toUTCString()], student.phone, { optedIn: true });
  } catch {
    /* template/transport issue — event still records the booking */
  }
  if (student.email) {
    await sendEmail(
      student.email,
      "Your EduNomad call is booked",
      `Booked for ${when.toUTCString()}. Reschedule: /reschedule/${booking.rescheduleToken}`,
    );
  }

  redirect(`/counsellor/leads/${studentId}?booked=1`);
}
