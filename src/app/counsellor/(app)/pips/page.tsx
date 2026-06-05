import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { managedCounsellors } from "@/lib/cm-stats";
import { createPipAction } from "../manage-actions";

export const metadata: Metadata = { title: "Improvement plans", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PipsPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const team = await managedCounsellors(session.userId);
  const nameBy = new Map(team.map((c) => [c.userId, c.fullName]));
  const pips = await prisma.pip.findMany({ where: { managerUserId: session.userId }, orderBy: { startedAt: "desc" } });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">Performance improvement plans</h1>
      <form action={createPipAction} className="mb-5 space-y-2 rounded-xl border border-line bg-white p-4">
        <select name="counsellorUserId" className="w-full rounded-lg border border-line px-3 py-2 text-sm">
          {team.map((c) => <option key={c.userId} value={c.userId}>{c.fullName}</option>)}
        </select>
        <textarea name="reason" rows={2} placeholder="Reason / focus areas" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Start PIP (4 weekly checkpoints)</button>
      </form>
      <ul className="space-y-2">
        {pips.map((p) => (
          <li key={p.id} className="rounded-xl border border-line bg-white p-3.5 text-sm">
            <p className="font-semibold text-navy">{nameBy.get(p.counsellorUserId) ?? p.counsellorUserId} · {p.status}</p>
            <p className="text-muted">{p.reason}</p>
            <p className="mt-1 text-xs text-muted">Checkpoints: {((p.checkpoints as string[] | null) ?? []).join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
