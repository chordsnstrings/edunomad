import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { getAvailableSlots, COUNTRY_TZ } from "@/lib/booking";
import { BookingCalendar } from "@/components/counsellor/BookingCalendar";
import { createBookingAction } from "./actions";

export const metadata: Metadata = { title: "Book call", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) notFound();
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) redirect("/counsellor");

  const days = await getAvailableSlots(session.userId, 7);
  const studentTz = COUNTRY_TZ[student.sourceCountry] ?? "Asia/Dhaka";

  return (
    <div>
      <Link href={`/counsellor/leads/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Lead
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Book a call</h1>
      <p className="mt-1 text-sm text-muted">Pick a slot in the next 7 days.</p>
      <div className="mt-5">
        <BookingCalendar days={days} studentTz={studentTz} action={createBookingAction} hiddenFields={{ studentId: id }} />
      </div>
    </div>
  );
}
