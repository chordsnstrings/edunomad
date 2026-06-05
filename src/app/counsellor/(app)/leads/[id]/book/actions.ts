"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { createBooking } from "@/lib/booking";
import { emit } from "@/lib/events";
import { whatsappSend } from "@/lib/whatsapp";
import { sendEmail } from "@/lib/email";

export async function createBookingAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) redirect("/counsellor/login");
  const studentId = String(formData.get("studentId") ?? "");
  const startsAt = String(formData.get("startsAt") ?? "");
  const durationMin = Number(formData.get("durationMin") ?? 45);
  if (!studentId || !startsAt) redirect("/counsellor");

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) redirect("/counsellor");

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
