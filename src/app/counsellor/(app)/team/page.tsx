import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";
import { AutoRefresh } from "@/components/counsellor/AutoRefresh";

export const metadata: Metadata = { title: "Team", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");

  const team = await prisma.counsellorProfile.findMany({ where: { managerId: session.userId, active: true } });
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);

  // Whole-team metrics in four queries. Previously this ran up to two queries per
  // student per counsellor (a 5x25 team meant ~250 round-trips per page load).
  const teamIds = team.map((c) => c.userId);
  const students = await prisma.student.findMany({
    where: { assignedCounsellorId: { in: teamIds } },
    select: { id: true, createdAt: true, assignedCounsellorId: true },
  });
  const allStudentIds = students.map((s) => s.id);

  const [calls, commCounts, lockEvents] = await Promise.all([
    prisma.communication.findMany({
      where: { studentId: { in: allStudentIds }, type: "call" },
      orderBy: { createdAt: "desc" },
      select: { studentId: true, metadata: true },
    }),
    prisma.communication.groupBy({
      by: ["studentId"],
      where: { studentId: { in: allStudentIds } },
      _count: { _all: true },
    }),
    prisma.event.findMany({
      where: { type: "shortlist.locked", studentId: { in: allStudentIds }, createdAt: { gte: sevenDaysAgo } },
      select: { studentId: true },
    }),
  ]);

  // Newest-first, so the first row per student is their latest call outcome.
  const latestOutcome = new Map<string, string | undefined>();
  for (const c of calls) {
    if (latestOutcome.has(c.studentId)) continue;
    latestOutcome.set(c.studentId, (c.metadata as { outcomeTag?: string } | null)?.outcomeTag);
  }
  const commCountBy = new Map(commCounts.map((c) => [c.studentId, c._count._all]));
  const lockedBy = new Map<string, number>();
  for (const e of lockEvents) {
    if (e.studentId) lockedBy.set(e.studentId, (lockedBy.get(e.studentId) ?? 0) + 1);
  }

  const rows = team.map((c) => {
    const mine = students.filter((s) => s.assignedCounsellorId === c.userId);
    let hot = 0, warm = 0, cold = 0, breaches = 0, locked = 0;
    for (const s of mine) {
      const o = latestOutcome.get(s.id);
      if (o === "hot") hot++;
      else if (o === "warm") warm++;
      else if (o === "cold") cold++;
      // SLA: assigned over 4h ago and still never contacted.
      if (Date.now() - +s.createdAt > 4 * 3600 * 1000 && (commCountBy.get(s.id) ?? 0) === 0) breaches++;
      locked += lockedBy.get(s.id) ?? 0;
    }
    const conversion = mine.length ? Math.round((locked / mine.length) * 100) : 0;
    return { name: c.fullName, pipeline: mine.length, hot, warm, cold, conversion, breaches };
  });

  return (
    <div>
      <AutoRefresh />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-navy">Team</h1>
        <Link href="/counsellor/tiers" className="text-sm text-navy underline">Performance tiers →</Link>
      </div>
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
