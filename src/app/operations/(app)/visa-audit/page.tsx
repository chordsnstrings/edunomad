import type { Metadata } from "next";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { studentNames } from "@/lib/lookups";
import { EmptyState } from "@/components/ui/EmptyState";
import { auditPassAction } from "./actions";

export const metadata: Metadata = { title: "Pre-compliance audit", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function VisaAuditPage() {
  const session = await requireStaff(["operations_team", "operations_manager"], "/operations/login");
  if (session.role !== "operations_manager") redirect("/operations");

  const files = await prisma.visaFile.findMany({ where: { readyForSignoffAt: { not: null }, signedOffAt: null }, orderBy: { readyForSignoffAt: "asc" }, take: 100 });
  const names = await studentNames(files.map((f) => f.studentId));
  const rows = files.map((f) => ({ f, who: names.get(f.studentId) ?? "" }));

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Pre-Compliance audit</h1>
      <p className="mb-4 text-sm text-muted">Audit visa files before they reach Compliance.</p>
      {rows.length === 0 ? (
        <EmptyState title="Nothing to audit" body="Visa files marked ready appear here for your pre-Compliance audit." />
      ) : (
        <ul className="space-y-2">
          {rows.map(({ f, who }) => (
            <li key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">{who}</p>
                <p className="text-xs text-muted">{f.destinationCountry} · {f.completenessPct}%</p>
              </div>
              <form action={auditPassAction}>
                <input type="hidden" name="fileId" value={f.id} />
                <SubmitButton className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700" pendingLabel="Working…">Audit passed</SubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
