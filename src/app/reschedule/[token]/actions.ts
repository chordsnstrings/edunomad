"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { emit } from "@/lib/events";
import { text } from "@/lib/form";

export async function rescheduleAction(formData: FormData) {
  const token = text(formData, "token");
  const startsAt = text(formData, "startsAt");
  if (!token || !startsAt) return;

  const booking = await prisma.booking.findUnique({ where: { rescheduleToken: token } });
  if (!booking) redirect("/");

  await prisma.booking.update({
    where: { id: booking.id },
    data: { startsAt: new Date(startsAt), status: "rescheduled" },
  });
  await emit({
    type: "call.rescheduled",
    stage: 2,
    studentId: booking.studentId,
    actorType: "student",
    visibility: { S: true, C: true, CM: true },
    channels: { in_app: true, whatsapp: true },
    payload: { startsAt },
  });
  redirect(`/reschedule/${token}?done=1`);
}
