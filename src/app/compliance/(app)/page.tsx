import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Sign-off queue", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SignoffQueue() {
  await requireStaff(["compliance"]);
  const files = await prisma.visaFile.findMany({ where: { readyForSignoffAt: { not: null }, signedOffAt: null }, orderBy: { readyForSignoffAt: "asc" }, take: 100 });
  const rows = await Promise.all(
    files.map(async (f) => {
      const student = await prisma.student.findUnique({ where: { id: f.studentId }, select: { fullName: true, phone: true } });
      return { f, who: student?.fullName ?? student?.phone ?? "" };
    }),
  );

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Visa files for sign-off</h1>
      <p className="mb-4 text-sm text-muted">Sole legal sign-off authority. Each file is re-auth + stamped.</p>
      {rows.length === 0 ? (
        <EmptyState title="No files awaiting sign-off" body="Visa files marked ready by Operations appear here." />
      ) : (
        <ul className="space-y-2">
          {rows.map(({ f, who }) => (
            <li key={f.id}>
              <Link href={`/compliance/files/${f.id}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 hover:border-navy">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{who}</p>
                  <p className="text-xs text-muted">{f.destinationCountry} · {f.completenessPct}% complete{f.returnedForChanges ? " · returned" : ""}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
