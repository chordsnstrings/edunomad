import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { addTrainingAction } from "./actions";

export const metadata: Metadata = { title: "Training log", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TrainingLogPage() {
  const logs = await prisma.trainingLog.findMany({ orderBy: { completedAt: "desc" }, take: 200 });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-navy">Compliance training log</h1>
      <form action={addTrainingAction} className="mb-5 flex flex-wrap gap-2 rounded-xl border border-line bg-white p-4">
        <input name="staffName" placeholder="Staff member" className="rounded-lg border border-line px-3 py-2 text-sm" />
        <input name="topic" placeholder="Training topic" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
        <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Log</button>
      </form>
      <ul className="space-y-1.5">
        {logs.map((l) => (
          <li key={l.id} className="rounded-lg border border-line bg-white px-3 py-2 text-sm"><span className="font-medium text-navy">{l.staffName}</span> · {l.topic} <span className="text-xs text-muted">· {l.completedAt.toLocaleDateString()}</span></li>
        ))}
      </ul>
    </div>
  );
}
