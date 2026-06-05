import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { renderEventTemplate } from "@/lib/event-templates";

export const metadata: Metadata = { title: "File audit log", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function FileAuditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(["compliance"]);
  const { id } = await params;
  const vf = await prisma.visaFile.findUnique({ where: { id } });
  if (!vf) notFound();
  const audits = await prisma.auditLog.findMany({ where: { targetType: "VisaFile", targetId: id }, orderBy: { seq: "desc" } });
  const events = await prisma.event.findMany({ where: { applicationId: vf.applicationId }, orderBy: { seq: "desc" }, take: 50 });

  return (
    <div>
      <Link href={`/compliance/files/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> File</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">File audit log</h1>

      <section className="mt-4">
        <h2 className="mb-2 text-sm font-semibold text-navy">Audit entries (hash-chained)</h2>
        {audits.length === 0 ? <p className="text-sm text-muted">No audit entries.</p> : (
          <ul className="space-y-1.5">
            {audits.map((a) => (
              <li key={a.id} className="rounded-lg border border-line bg-white px-3 py-2 text-sm">
                <p className="text-ink">{a.action} · <span className={a.result === "denied" ? "text-red-600" : "text-green-700"}>{a.result}</span></p>
                {a.reason && <p className="text-xs text-muted">{a.reason}</p>}
                <p className="font-mono text-[10px] text-muted">{a.chainHash.slice(0, 24)}… · {a.createdAt.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-navy">Events</h2>
        <ul className="space-y-1.5">
          {events.map((e) => (
            <li key={e.id} className="text-sm text-ink">{renderEventTemplate({ type: e.type, payload: e.payload as Record<string, unknown> | null }, "en")} <span className="text-xs text-muted">· {e.createdAt.toLocaleDateString()}</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
