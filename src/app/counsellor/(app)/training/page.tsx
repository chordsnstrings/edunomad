import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { scheduleTrainingAction } from "../manage-actions";

export const metadata: Metadata = { title: "Training", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const sessions = await prisma.trainingSession.findMany({ orderBy: { scheduledAt: "desc" }, take: 100 });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">Training sessions</h1>
      <form action={scheduleTrainingAction} className="mb-5 flex flex-wrap gap-2">
        <input name="topic" placeholder="Topic" aria-label="Topic" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
        <input aria-label="Scheduled At" type="datetime-local" name="scheduledAt" className="rounded-lg border border-line px-3 py-2 text-sm" />
        <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Schedule</button>
      </form>
      <ul className="space-y-2">
        {sessions.map((t) => (
          <li key={t.id} className="rounded-xl border border-line bg-white p-3.5 text-sm">
            <span className="font-medium text-navy">{t.topic}</span> <span className="text-xs text-muted">· {t.scheduledAt.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
