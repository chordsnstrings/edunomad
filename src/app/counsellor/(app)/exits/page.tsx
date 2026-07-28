import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { addExitAction } from "../manage-actions";

export const metadata: Metadata = { title: "Exit interviews", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ExitsPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const exits = await prisma.exitInterview.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">Exit interviews</h1>
      <form action={addExitAction} className="mb-5 space-y-2 rounded-xl border border-line bg-white p-4">
        <input name="name" placeholder="Counsellor name" aria-label="Counsellor name" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <input name="reason" placeholder="Reason for leaving" aria-label="Reason for leaving" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <textarea name="notes" rows={2} placeholder="Notes" aria-label="Notes" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Log exit interview</button>
      </form>
      <ul className="space-y-2">
        {exits.map((e) => (
          <li key={e.id} className="rounded-xl border border-line bg-white p-3.5 text-sm">
            <p className="font-semibold text-navy">{e.counsellorName}</p>
            <p className="text-muted">{e.reason}{e.notes ? ` — ${e.notes}` : ""}</p>
            <p className="text-xs text-muted">{e.createdAt.toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
