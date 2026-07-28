import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { programmesById } from "@/lib/lookups";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "SLA tracker", robots: { index: false } };
export const dynamic = "force-dynamic";

const SLA_DAYS = 21;

export default async function SlaPage() {
  await requireStaff(["operations_team", "operations_manager"]);
  const apps = await prisma.application.findMany({
    where: { submittedAt: { not: null }, submissionStatus: { in: ["submitted", "acknowledged", "under_review", "info_requested"] } },
    orderBy: { submittedAt: "asc" },
    take: 200,
  });
  const progs = await programmesById(apps.map((a) => a.programmeId));
  const rows = apps.map((a) => {
    const days = a.submittedAt ? Math.floor((Date.now() - +a.submittedAt) / 86_400_000) : 0;
    return {
      id: a.id,
      institution: progs.get(a.programmeId)?.institution.name ?? "",
      status: a.submissionStatus,
      days,
      breach: days > SLA_DAYS,
    };
  });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">University SLA tracker</h1>
      <p className="mb-4 text-sm text-muted">Days since submission. Breaches over {SLA_DAYS} days are flagged.</p>
      {rows.length === 0 ? (
        <EmptyState title="No submitted applications" body="Submitted applications and their response SLAs appear here." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="p-3">Institution</th><th className="p-3">Status</th><th className="p-3">Days</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={`border-b border-line/60 last:border-0 ${r.breach ? "bg-red-50" : ""}`}>
                  <td className="p-3 text-navy">{r.institution}</td>
                  <td className="p-3 text-muted">{r.status}</td>
                  <td className={`p-3 font-semibold ${r.breach ? "text-red-600" : "text-muted"}`}>{r.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
