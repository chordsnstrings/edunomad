import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { resolveIncidentAction, scheduleReviewAction } from "../actions";

export const metadata: Metadata = { title: "Incident", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function IncidentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inc = await prisma.incident.findUnique({ where: { id } });
  if (!inc) notFound();
  const runbook = (inc.runbook as string[] | null) ?? [];

  return (
    <div className="max-w-2xl">
      <Link href="/admin/incidents" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Incidents</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{inc.title}</h1>
      <p className="mb-4 text-sm text-muted">{inc.severity.toUpperCase()} · {inc.status}</p>

      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-navy">Runbook</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-ink">{runbook.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </section>

      {inc.status !== "resolved" && (
        <form action={resolveIncidentAction} className="mt-4">
          <input type="hidden" name="id" value={id} />
          <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Mark resolved</button>
        </form>
      )}

      <section className="mt-4 rounded-xl border border-line bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-navy">Post-incident review</h2>
        {inc.reviewScheduledAt && <p className="mb-2 text-sm text-muted">Scheduled: {inc.reviewScheduledAt.toLocaleString()}</p>}
        <form action={scheduleReviewAction} className="space-y-2">
          <input type="hidden" name="id" value={id} />
          <input aria-label="When" type="datetime-local" name="when" className="rounded-lg border border-line px-3 py-2 text-sm" />
          <textarea name="notes" rows={3} defaultValue={inc.reviewNotes ?? ""} placeholder="Review notes / learnings / action items" aria-label="Review notes / learnings / action items" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Save review</button>
        </form>
      </section>
    </div>
  );
}
