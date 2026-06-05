import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { SEVERITIES } from "@/lib/incident";
import { createIncidentAction } from "./actions";

export const metadata: Metadata = { title: "Incidents", robots: { index: false } };
export const dynamic = "force-dynamic";

const SEV_COLOR: Record<string, string> = { sev1: "bg-red-100 text-red-700", sev2: "bg-amber-100 text-amber-700", sev3: "bg-subtle text-muted" };

export default async function IncidentsPage() {
  const incidents = await prisma.incident.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-navy">Incident response</h1>
      <p className="mb-5 text-sm text-muted">Declaring an incident loads the severity runbook.</p>
      <form action={createIncidentAction} className="mb-6 flex flex-wrap gap-2 rounded-xl border border-line bg-white p-4">
        <input name="title" placeholder="What happened?" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
        <select name="severity" className="rounded-lg border border-line px-2 py-2 text-sm">{SEVERITIES.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}</select>
        <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Declare incident</button>
      </form>
      <ul className="space-y-2">
        {incidents.map((i) => (
          <li key={i.id}>
            <Link href={`/admin/incidents/${i.id}`} className="flex items-center justify-between rounded-xl border border-line bg-white p-4 hover:border-navy">
              <div><p className="text-sm font-semibold text-navy">{i.title}</p><p className="text-xs text-muted">{i.status} · {i.createdAt.toLocaleString()}</p></div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${SEV_COLOR[i.severity]}`}>{i.severity}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
