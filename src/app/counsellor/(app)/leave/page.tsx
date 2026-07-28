import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { managedCounsellors } from "@/lib/cm-stats";
import { addLeaveAction, setCapacityAction } from "../manage-actions";

export const metadata: Metadata = { title: "Leave & capacity", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LeavePage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const team = await managedCounsellors(session.userId);
  const nameBy = new Map(team.map((c) => [c.userId, c.fullName]));
  const leaves = await prisma.leaveRecord.findMany({ where: { counsellorUserId: { in: team.map((c) => c.userId) } }, orderBy: { fromDate: "desc" }, take: 50 });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="mb-3 text-xl font-semibold text-navy">Capacity</h1>
        <ul className="space-y-2">
          {team.map((c) => (
            <li key={c.userId} className="flex items-center justify-between rounded-xl border border-line bg-white p-3 text-sm">
              <span className="text-navy">{c.fullName}</span>
              <form action={setCapacityAction} className="flex gap-2">
                <input type="hidden" name="counsellorUserId" value={c.userId} />
                <input aria-label="Capacity" name="capacity" defaultValue={c.capacity} inputMode="numeric" className="w-20 rounded-lg border border-line px-2 py-1 text-sm" />
                <button className="rounded-lg border border-navy px-3 py-1 text-sm font-semibold text-navy">Set</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy">Leave</h2>
        <form action={addLeaveAction} className="mb-3 flex flex-wrap gap-2">
          <select aria-label="Counsellor User" name="counsellorUserId" className="rounded-lg border border-line px-2 py-1.5 text-sm">{team.map((c) => <option key={c.userId} value={c.userId}>{c.fullName}</option>)}</select>
          <input aria-label="From" type="date" name="from" className="rounded-lg border border-line px-2 py-1.5 text-sm" />
          <input aria-label="To" type="date" name="to" className="rounded-lg border border-line px-2 py-1.5 text-sm" />
          <button className="rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white">Add leave</button>
        </form>
        <ul className="space-y-1.5">
          {leaves.map((l) => (
            <li key={l.id} className="rounded-lg border border-line bg-white px-3 py-2 text-sm">{nameBy.get(l.counsellorUserId)} · {l.fromDate.toLocaleDateString()}–{l.toDate.toLocaleDateString()}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
