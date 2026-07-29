import { randomUUID } from "node:crypto";
import { prisma } from "./db";

/** Corridor timezone for counsellor availability (Phase 1: Bangladesh). */
const BOOKING_TIMEZONE = process.env.BOOKING_TIMEZONE || "Asia/Dhaka";

export type Slot = { startsAt: string; label: string };
export type DaySlots = { date: string; slots: Slot[] };

export const COUNTRY_TZ: Record<string, string> = { BD: "Asia/Dhaka", IN: "Asia/Kolkata", NP: "Asia/Kathmandu" };

/** Available hourly slots (09:00–16:00) for the next `days` days, minus booked. */
export async function getAvailableSlots(counsellorUserId: string, days = 7): Promise<DaySlots[]> {
  const booked = await prisma.booking.findMany({
    where: { counsellorUserId, status: { in: ["scheduled", "rescheduled"] }, startsAt: { gte: new Date() } },
    select: { startsAt: true },
  });
  const taken = new Set(booked.map((b) => b.startsAt.toISOString()));
  const out: DaySlots[] = [];
  const now = new Date();
  for (let d = 1; d <= days; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    day.setHours(0, 0, 0, 0);
    const slots: Slot[] = [];
    for (let h = 9; h <= 16; h++) {
      const s = new Date(day);
      s.setHours(h, 0, 0, 0);
      const iso = s.toISOString();
      // Slots are generated in the CORRIDOR's timezone, not the server's. Using
      // setHours on a server in UTC labelled 09:00 for a slot that is 15:00 in
      // Dhaka, so students were offered times that were not the times shown.
      const label = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: BOOKING_TIMEZONE,
      }).format(s);
      if (!taken.has(iso)) slots.push({ startsAt: iso, label });
    }
    out.push({ date: day.toISOString(), slots });
  }
  return out;
}

export async function createBooking(studentId: string, counsellorUserId: string, startsAt: string, durationMin = 45) {
  return prisma.booking.create({
    data: { studentId, counsellorUserId, startsAt: new Date(startsAt), durationMin, rescheduleToken: randomUUID() },
  });
}
