import type { Metadata } from "next";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { programmesById, studentNames } from "@/lib/lookups";
import { EmptyState } from "@/components/ui/EmptyState";
import { approveAction } from "./actions";

export const metadata: Metadata = { title: "Approvals", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const session = await requireStaff(["operations_team", "operations_manager"], "/operations/login");
  if (session.role !== "operations_manager") redirect("/operations");

  const apps = await prisma.application.findMany({ where: { submissionStatus: "packaged", opsApproved: false }, take: 100 });
  const [progs, names] = await Promise.all([
    programmesById(apps.map((a) => a.programmeId)),
    studentNames(apps.map((a) => a.studentId)),
  ]);
  const rows = apps.map((a) => {
    const prog = progs.get(a.programmeId);
    return {
      app: a,
      name: prog?.name ?? "",
      institution: prog?.institution.name ?? "",
      who: names.get(a.studentId) ?? "",
    };
  });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Application approvals</h1>
      <p className="mb-4 text-sm text-muted">Packaged applications awaiting pre-submission sign-off.</p>
      {rows.length === 0 ? (
        <EmptyState title="Nothing to approve" body="Packaged applications appear here for your sign-off." />
      ) : (
        <ul className="space-y-2">
          {rows.map(({ app, name, institution, who }) => (
            <li key={app.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">{who}</p>
                <p className="truncate text-xs text-muted">{institution} · {name}</p>
              </div>
              <form action={approveAction}>
                <input type="hidden" name="appId" value={app.id} />
                <SubmitButton className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700" pendingLabel="Working…">Approve</SubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
