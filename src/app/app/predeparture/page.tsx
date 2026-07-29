import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Plane,
  Home,
  Landmark,
  Wifi,
  ShieldPlus,
  Car,
  FileText,
  MapPin,
} from "lucide-react";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { listServiceBookings } from "@/lib/services";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { getTranslator } from "@/i18n";
import { getUserLocale } from "@/i18n/server";
import { cancelServiceAction, requestServiceAction } from "./actions";

export const metadata: Metadata = { title: "Pre-departure", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PreDeparturePage() {
  const { student } = await requireStudent();
  const t = getTranslator(await getUserLocale());
  const [visa, invoices] = await Promise.all([
    prisma.visaFile.findFirst({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.findMany({ where: { studentId: student.id } }),
  ]);
  const paid = (purpose: string) =>
    invoices.some((i) => i.purpose.includes(purpose) && i.status === "paid");
  const visaApproved = visa?.decisionStatus === "approved";

  // Auto-tracked from the student's actual record.
  const tracked = [
    { label: "Visa approved", done: visaApproved, note: visaApproved ? "You're cleared to travel." : "We'll notify you the moment IRCC decides." },
    { label: "Passport returned with visa", done: !!visa?.passportReturnedAt, note: "Collect from VFS and check the visa details carefully." },
    { label: "Tuition deposit paid", done: paid("tuition"), note: "Keep the receipt — you may need it at the border." },
    { label: "GIC account funded", done: paid("gic"), note: "Your proof of funds for the study permit." },
  ];

  // To arrange. Partner-facing UIs are Phase 2, but the request is recorded as
  // a real ServiceBooking so a coordinator has something to act on — this list
  // used to be static markup that persisted nothing when a student needed help.
  const bookings = await listServiceBookings(student.id);
  const byType = new Map(bookings.map((b) => [b.serviceType, b]));
  const arrange = [
    { type: "housing" as const, icon: Home, note: "On-campus or private — confirm before you fly." },
    { type: "bank" as const, icon: Landmark, note: "Open an account in your first week to receive funds." },
    { type: "sim" as const, icon: Wifi, note: "We'll help you pick a plan for your first weeks." },
    { type: "insurance" as const, icon: ShieldPlus, note: "Some provinces have a waiting period — get cover early." },
    { type: "transport" as const, icon: Car, note: "Especially for late-night arrivals." },
  ];

  const carry = [
    "Passport with study permit / visa",
    "Letter of Acceptance (LOA)",
    "Proof of GIC and tuition payment",
    "Medical and vaccination records",
    "Copies of academic transcripts",
  ];

  const onArrival = [
    "Collect your study permit at the Port of Entry — have your LOA and proof of funds ready.",
    "Check the permit for your name, programme, and expiry before leaving the counter.",
    "Activate your GIC and open a local bank account in your first week.",
    "Register at your institution and complete any orientation steps.",
  ];

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-xl font-semibold text-navy">{t("app.nav.predeparture")}</h1>
      <p className="mt-1 text-sm text-muted">
        {visaApproved
          ? "Your visa is approved. Here's everything to settle before you fly — and what to do when you land."
          : "Here's what your final stage looks like. Items tick off automatically as you progress."}
      </p>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-navy">{t("app.predeparture.progress")}</h2>
        <ul className="space-y-2">
          {tracked.map((t) => (
            <li key={t.label} className="flex gap-3 rounded-xl border border-line bg-white p-3.5">
              {t.done ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
              )}
              <div className="min-w-0">
                <p className={`text-sm font-medium ${t.done ? "text-navy" : "text-ink"}`}>{t.label}</p>
                <p className="text-xs text-muted">{t.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-navy">{t("app.predeparture.to_arrange")}</h2>
        <ul className="space-y-2">
          {arrange.map((a) => {
            const booking = byType.get(a.type);
            const open = booking && booking.status !== "cancelled";
            const confirmed = booking?.status === "confirmed";
            return (
              <li key={a.type} className="rounded-xl border border-line bg-white p-3.5">
                <div className="flex gap-3">
                  <a.icon className="mt-0.5 h-5 w-5 shrink-0 text-navy" strokeWidth={1.75} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{t(`service.${a.type}`)}</p>
                    <p className="text-xs text-muted">
                      {open ? t("app.predeparture.request_note") : a.note}
                    </p>
                  </div>
                  {open && (
                    <span
                      className={`h-fit shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        confirmed ? "bg-green-100 text-green-800" : "bg-gold-100 text-gold-700"
                      }`}
                    >
                      {confirmed ? t("app.predeparture.confirmed") : t("app.predeparture.requested")}
                    </span>
                  )}
                </div>
                {!confirmed && (
                  <form
                    action={open ? cancelServiceAction : requestServiceAction}
                    className="mt-2.5 flex justify-end"
                  >
                    <input type="hidden" name="serviceType" value={a.type} />
                    <SubmitButton
                      className={`min-h-11 rounded-lg px-3.5 text-sm font-semibold ${
                        open
                          ? "border border-line text-muted hover:bg-subtle"
                          : "border border-navy text-navy hover:bg-subtle"
                      }`}
                    >
                      {open ? t("app.predeparture.cancel_request") : t("app.predeparture.request")}
                    </SubmitButton>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex gap-3 rounded-xl border border-line bg-white p-3.5">
          <Plane className="mt-0.5 h-5 w-5 shrink-0 text-navy" strokeWidth={1.75} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink">Book your flights</p>
            <p className="text-xs text-muted">Book only after visa approval, then share your itinerary.</p>
          </div>
        </div>
        <Link
          href="/app/messages"
          className="mt-3 block rounded-xl border border-navy bg-navy px-4 py-3 text-center text-sm font-semibold text-white hover:bg-navy-700"
        >
          {t("app.predeparture.message_cta")}
        </Link>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-white p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-navy">
          <FileText className="h-4 w-4 text-gold-600" /> {t("app.predeparture.carry")}
        </h2>
        <ul className="mt-2 space-y-1.5">
          {carry.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-ink">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-white p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-navy">
          <MapPin className="h-4 w-4 text-gold-600" /> {t("app.predeparture.on_arrival")}
        </h2>
        <ol className="mt-2 space-y-2">
          {onArrival.map((step, i) => (
            <li key={step} className="flex gap-2.5 text-sm text-ink">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-subtle text-xs font-semibold text-navy">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
