import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Team", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");

  const team = await prisma.counsellorProfile.findMany({ where: { managerId: session.userId, active: true } });
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);

  const rows = await Promise.all(
    team.map(async (c) => {
      const students = await prisma.student.findMany({ where: { assignedCounsellorId: c.userId }, select: { id: true, createdAt: true } });
      const ids = students.map((s) => s.id);
      let hot = 0, warm = 0, cold = 0;
      let breaches = 0;
      for (const s of students) {
        const lc = await prisma.communication.findFirst({ where: { studentId: s.id, type: "call" }, orderBy: { createdAt: "desc" }, select: { metadata: true } });
        const o = (lc?.metadata as { outcomeTag?: string } | null)?.outcomeTag;
        if (o === "hot") hot++;
        else if (o === "warm") warm++;
        else if (o === "cold") cold++;
        if (Date.now() - +s.createdAt > 4 * 3600 * 1000) {
          const commCount = await prisma.communication.count({ where: { studentId: s.id } });
          if (commCount === 0) breaches++;
        }
      }
      const locked = ids.length
        ? await prisma.event.count({ where: { type: "shortlist.locked", studentId: { in: ids }, createdAt: { gte: sevenDaysAgo } } })
        : 0;
      const conversion = students.length ? Math.round((locked / students.length) * 100) : 0;
      return { name: c.fullName, pipeline: students.length, hot, warm, cold, conversion, breaches };
    }),
  );

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">Team</h1>
      {rows.length === 0 ? (
        <EmptyState title="No counsellors yet" body="Counsellors you manage will appear here with live pipeline metrics." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted">
                <th className="p-3">Counsellor</th>
                <th className="p-3">Pipeline</th>
                <th className="p-3">Hot</th>
                <th className="p-3">Warm</th>
                <th className="p-3">Cold</th>
                <th className="p-3">Conv. 7d</th>
                <th className="p-3">SLA</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-line/60 last:border-0">
                  <td className="p-3 font-medium text-navy">{r.name}</td>
                  <td className="p-3">{r.pipeline}</td>
                  <td className="p-3 text-green-700">{r.hot}</td>
                  <td className="p-3 text-amber-700">{r.warm}</td>
                  <td className="p-3 text-muted">{r.cold}</td>
                  <td className="p-3">{r.conversion}%</td>
                  <td className={`p-3 font-semibold ${r.breaches > 0 ? "text-red-600" : "text-muted"}`}>{r.breaches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
