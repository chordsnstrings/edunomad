import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { managedCounsellors } from "@/lib/cm-stats";
import { reassignWithHandoffAction } from "../manage-actions";

export const metadata: Metadata = { title: "Reassign", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ReassignPage({ searchParams }: { searchParams: Promise<{ hot?: string }> }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const { hot } = await searchParams;
  const team = await managedCounsellors(session.userId);
  const ids = team.map((c) => c.userId);
  let students = await prisma.student.findMany({ where: { assignedCounsellorId: { in: ids } }, orderBy: { leadScore: "desc" }, take: 200 });
  if (hot === "1") students = students.filter((s) => s.leadScore >= 70);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-navy">Reassign leads</h1>
        <Link href={hot === "1" ? "/counsellor/reassign" : "/counsellor/reassign?hot=1"} className="text-sm text-navy underline">{hot === "1" ? "Show all" : "Hot leads only"}</Link>
      </div>
      <ul className="space-y-2">
        {students.map((s) => (
          <li key={s.id} className="rounded-xl border border-line bg-white p-3.5">
            <p className="text-sm font-semibold text-navy">{s.fullName ?? s.phone} <span className="text-xs text-muted">· score {s.leadScore}</span></p>
            <form action={reassignWithHandoffAction} className="mt-2 flex flex-wrap gap-2">
              <input type="hidden" name="studentId" value={s.id} />
              <select name="counsellorUserId" defaultValue={s.assignedCounsellorId ?? ""} className="rounded-lg border border-line px-2 py-1.5 text-sm">
                {team.map((c) => <option key={c.userId} value={c.userId}>{c.fullName}</option>)}
              </select>
              <input name="handoff" placeholder="Handoff note (context)" className="flex-1 rounded-lg border border-line px-3 py-1.5 text-sm" />
              <button className="rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white">Reassign</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
