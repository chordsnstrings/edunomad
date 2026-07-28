import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { addCandidateAction, advanceCandidateAction } from "../manage-actions";

export const metadata: Metadata = { title: "Hiring", robots: { index: false } };
export const dynamic = "force-dynamic";

const STAGES = ["applied", "screen", "interview", "offer", "hired", "rejected"];

export default async function HiringPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const candidates = await prisma.candidate.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">Hiring pipeline</h1>
      <form action={addCandidateAction} className="mb-5 flex gap-2">
        <input name="name" placeholder="Candidate name" aria-label="Candidate name" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
        <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Add</button>
      </form>
      <ul className="space-y-2">
        {candidates.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-white p-3.5 text-sm">
            <span className="font-medium text-navy">{c.name}</span>
            <form action={advanceCandidateAction} className="flex gap-2">
              <input type="hidden" name="id" value={c.id} />
              <select aria-label="Stage" name="stage" defaultValue={c.stage} className="rounded-lg border border-line px-2 py-1.5 text-sm">
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="rounded-lg border border-navy px-3 py-1.5 text-sm font-semibold text-navy">Update</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
