import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone, BookOpen } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { renderEventTemplate } from "@/lib/event-templates";
import { leadScoreBreakdown } from "@/lib/leadscore";
import { matchSnippets } from "@/lib/sop-snippets";
import { NotesEditor } from "@/components/counsellor/NotesEditor";

export const metadata: Metadata = { title: "Lead", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) notFound();
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) redirect("/counsellor");

  const note = await prisma.note.findUnique({
    where: { studentId_authorUserId: { studentId: id, authorUserId: session.userId } },
  });
  const events = await prisma.event.findMany({ where: { studentId: id }, orderBy: { seq: "desc" }, take: 20 });
  const breakdown = leadScoreBreakdown(student as Parameters<typeof leadScoreBreakdown>[0]);
  const snippets = matchSnippets(student as Parameters<typeof matchSnippets>[0]);
  const dests = (student.destinations as string[] | null) ?? [];

  return (
    <div>
      <Link href="/counsellor" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Inbox
      </Link>

      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h1 className="text-lg font-semibold text-navy">{student.fullName ?? student.phone}</h1>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted">
              <span>Source: {student.sourceCountry}</span>
              <span>Field: {student.fieldOfStudy ?? "—"}</span>
              <span>Budget: {student.budgetMaxUsd ? `$${student.budgetMaxUsd.toLocaleString()}` : "—"}</span>
              <span>Destinations: {dests.join(", ") || "—"}</span>
            </div>
            <div className="mt-4 flex gap-3">
              <Link href={`/counsellor/leads/${id}/whatsapp`} className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Link>
              <Link href={`/counsellor/leads/${id}/book`} className="inline-flex items-center gap-2 rounded-lg border border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-subtle">
                <Phone className="h-4 w-4" /> Book call
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-navy">Lead score</h2>
              <span className="text-lg font-semibold text-navy">{student.leadScore}</span>
            </div>
            <ul className="space-y-2">
              {breakdown.map((f) => (
                <li key={f.factor} className="text-sm">
                  <div className="flex justify-between text-muted">
                    <span>{f.factor}</span>
                    <span>{f.points}/{f.max}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-subtle">
                    <div className="h-full rounded-full bg-gold-500" style={{ width: `${(f.points / f.max) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <NotesEditor studentId={id} initial={note?.body ?? ""} />
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-navy">History</h2>
            {events.length === 0 ? (
              <p className="text-sm text-muted">No activity yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {events.map((e) => (
                  <li key={e.id} className="flex gap-3 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                    <div>
                      <p className="text-ink">{renderEventTemplate({ type: e.type, payload: e.payload as Record<string, unknown> | null }, "en")}</p>
                      <p className="text-xs text-muted">{e.createdAt.toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-navy">
              <BookOpen className="h-4 w-4 text-gold-500" /> SOP guidance
            </div>
            {snippets.map((s) => (
              <div key={s.id} className="rounded-xl border border-line bg-white p-4">
                <p className="text-sm font-semibold text-navy">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
