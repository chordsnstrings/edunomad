import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";
import { acknowledgeEscalationAction } from "../actions";

export const metadata: Metadata = { title: "Escalations", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EmEscalations() {
  await requireStaff(["education_manager"], "/education/login");
  const [events, acks] = await Promise.all([
    prisma.event.findMany({
      where: { type: { in: ["escalation.raised", "complaint.filed"] } },
      orderBy: { seq: "desc" },
      take: 100,
    }),
    prisma.event.findMany({
      where: { type: "escalation.acknowledged" },
      select: { studentId: true },
    }),
  ]);
  const acked = new Set(acks.map((a) => a.studentId));
  const sids = [...new Set(events.map((e) => e.studentId).filter(Boolean))] as string[];
  const students = await prisma.student.findMany({
    where: { id: { in: sids } },
    select: { id: true, fullName: true },
  });
  const nameOf = (id: string | null) =>
    students.find((s) => s.id === id)?.fullName ?? "Student";

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Escalations &amp; complaints</h1>
      <p className="mb-4 text-sm text-muted">Oversight across the vertical. Acknowledge once reviewed.</p>
      {events.length === 0 ? (
        <EmptyState title="Nothing escalated" body="Raised escalations and filed complaints surface here for review." />
      ) : (
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">
                  {nameOf(e.studentId)} ·{" "}
                  {e.type === "complaint.filed" ? "Complaint" : "Escalation"}
                </p>
                <p className="text-xs text-muted">{new Date(e.createdAt).toLocaleDateString()}</p>
              </div>
              {e.studentId && acked.has(e.studentId) ? (
                <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                  Acknowledged
                </span>
              ) : (
                <form action={acknowledgeEscalationAction}>
                  <input type="hidden" name="studentId" value={e.studentId ?? ""} />
                  <button className="shrink-0 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-700">
                    Acknowledge
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
