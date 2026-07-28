import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { managedCounsellors } from "@/lib/cm-stats";
import { saveOneOnOneAction } from "../manage-actions";

export const metadata: Metadata = { title: "1:1", robots: { index: false } };
export const dynamic = "force-dynamic";

const AGENDA = ["Wins since last 1:1", "Pipeline health + at-risk cases", "QA feedback + coaching", "Blockers / support needed", "Development goal progress", "Action items for next week"];

export default async function OneOnOnePage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const team = await managedCounsellors(session.userId);
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">1:1 meeting</h1>
      <p className="mb-4 text-sm text-muted">Fixed agenda — work through each point.</p>
      <form action={saveOneOnOneAction} className="space-y-3 rounded-xl border border-line bg-white p-4">
        <select aria-label="Counsellor User" name="counsellorUserId" className="w-full rounded-lg border border-line px-3 py-2 text-sm">
          {team.map((c) => <option key={c.userId} value={c.userId}>{c.fullName}</option>)}
        </select>
        <ul className="space-y-1.5">
          {AGENDA.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink"><input type="checkbox" className="mt-0.5" /> {a}</li>
          ))}
        </ul>
        <textarea name="notes" rows={3} placeholder="Notes + action items" aria-label="Notes + action items" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Save 1:1</button>
      </form>
    </div>
  );
}
