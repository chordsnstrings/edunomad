import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { managedCounsellors } from "@/lib/cm-stats";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Escalations", robots: { index: false } };
export const dynamic = "force-dynamic";

const SLA_HOURS: Record<string, number> = { "escalation.raised": 4, "complaint.filed": 24 };

export default async function EscalationsPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const team = await managedCounsellors(session.userId);
  const students = await prisma.student.findMany({ where: { assignedCounsellorId: { in: team.map((c) => c.userId) } }, select: { id: true } });
  const events = await prisma.event.findMany({ where: { type: { in: ["escalation.raised", "complaint.filed"] }, studentId: { in: students.map((s) => s.id) } }, orderBy: { seq: "desc" }, take: 100 });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Escalation queue</h1>
      <p className="mb-4 text-sm text-muted">SLA: escalations 4h, complaints 24h.</p>
      {events.length === 0 ? (
        <EmptyState title="No open escalations" body="Parent escalations and complaints land here with SLA timers." />
      ) : (
        <ul className="space-y-2">
          {events.map((e) => {
            const ageH = (Date.now() - +e.createdAt) / 3_600_000;
            const breach = ageH > (SLA_HOURS[e.type] ?? 24);
            return (
              <li key={e.id} className={`flex items-center justify-between rounded-xl border bg-white p-3.5 text-sm ${breach ? "border-red-300" : "border-line"}`}>
                <div>
                  <p className="font-medium text-navy">{e.type === "escalation.raised" ? "Manager escalation" : "Complaint"}</p>
                  <p className="text-xs text-muted">{e.createdAt.toLocaleString()}</p>
                </div>
                <span className={`text-xs font-semibold ${breach ? "text-red-600" : "text-muted"}`}>{Math.floor(ageH)}h{breach ? " · SLA breach" : ""}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
