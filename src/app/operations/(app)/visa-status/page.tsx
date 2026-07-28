import type { Metadata } from "next";
import Link from "next/link";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { studentNames } from "@/lib/lookups";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Visa status", robots: { index: false } };
export const dynamic = "force-dynamic";

const COLOR: Record<string, string> = { approved: "text-green-700", refused: "text-red-600", info_requested: "text-amber-700", pending: "text-muted" };

export default async function VisaStatusPage() {
  await requireStaff(["operations_team", "operations_manager"]);
  // In production a scheduled job polls each regulator (e.g. IRCC) daily; here the
  // tracker reflects recorded decisions.
  const files = await prisma.visaFile.findMany({ where: { submittedAt: { not: null } }, orderBy: { submittedAt: "asc" }, take: 200 });
  const names = await studentNames(files.map((f) => f.studentId));
  const rows = files.map((f) => ({
    f,
    who: names.get(f.studentId) ?? "",
    days: f.submittedAt ? Math.floor((Date.now() - +f.submittedAt) / 86_400_000) : 0,
  }));

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Visa status tracker</h1>
      <p className="mb-4 text-sm text-muted">Submitted visa applications and their current decision status.</p>
      {rows.length === 0 ? (
        <EmptyState title="No submitted visa applications" body="Submitted visa files and their status appear here." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="p-3">Student</th><th className="p-3">Dest.</th><th className="p-3">Days</th><th className="p-3">Status</th></tr></thead>
            <tbody>
              {rows.map(({ f, who, days }) => (
                <tr key={f.id} className="border-b border-line/60 last:border-0">
                  <td className="p-3"><Link href={`/operations/visa/${f.applicationId}`} className="text-navy underline">{who}</Link></td>
                  <td className="p-3 text-muted">{f.destinationCountry}</td>
                  <td className="p-3 text-muted">{days}</td>
                  <td className={`p-3 font-semibold ${COLOR[f.decisionStatus]}`}>{f.decisionStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
