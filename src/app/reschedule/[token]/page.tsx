import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getAvailableSlots, COUNTRY_TZ } from "@/lib/booking";
import { BookingCalendar } from "@/components/counsellor/BookingCalendar";
import { rescheduleAction } from "./actions";

export const metadata: Metadata = { title: "Reschedule", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ done?: string }>;
}) {
  const { token } = await params;
  const { done } = await searchParams;
  const booking = await prisma.booking.findUnique({ where: { rescheduleToken: token } });
  if (!booking) notFound();
  const student = await prisma.student.findUnique({ where: { id: booking.studentId } });
  const tz = COUNTRY_TZ[student?.sourceCountry ?? "BD"] ?? "Asia/Dhaka";

  if (done) {
    return (
      <div className="grid min-h-screen place-items-center bg-subtle px-4">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-7 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
          <h1 className="mt-3 text-lg font-semibold text-navy">Call rescheduled</h1>
          <p className="mt-1 text-sm text-muted">
            New time: {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: tz }).format(booking.startsAt)}.
          </p>
        </div>
      </div>
    );
  }

  const days = await getAvailableSlots(booking.counsellorUserId, 7);
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 py-8">
      <h1 className="text-xl font-semibold text-navy">Reschedule your call</h1>
      <p className="mt-1 text-sm text-muted">
        Currently {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: tz }).format(booking.startsAt)}. Pick a new slot.
      </p>
      <div className="mt-5">
        <BookingCalendar days={days} studentTz={tz} action={rescheduleAction} hiddenFields={{ token }} withDuration={false} />
      </div>
    </div>
  );
}
