import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Operations queue", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function QueuePage() {
  await requireStaff(["operations_team", "operations_manager"]);
  const lockedApps = await prisma.application.findMany({ where: { shortlistStatus: "locked" }, select: { studentId: true } });
  const studentIds = [...new Set(lockedApps.map((a) => a.studentId))];
  const students = await prisma.student.findMany({ where: { id: { in: studentIds } } });

  const cases = await Promise.all(
    students.map(async (s) => {
      const locked = lockedApps.filter((a) => a.studentId === s.id).length;
      const docs = await prisma.document.count({ where: { studentId: s.id } });
      const lockEvent = await prisma.event.findFirst({ where: { studentId: s.id, type: "shortlist.locked" }, orderBy: { seq: "desc" }, select: { createdAt: true } });
      return { id: s.id, name: s.fullName ?? s.phone, source: s.sourceCountry, locked, docs, at: (lockEvent?.createdAt ?? s.updatedAt).toISOString() };
    }),
  );
  cases.sort((a, b) => +new Date(a.at) - +new Date(b.at)); // FIFO — oldest first

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Work queue</h1>
      <p className="mb-4 text-sm text-muted">Locked shortlists ready for packaging.</p>
      {cases.length === 0 ? (
        <EmptyState title="Queue is clear" body="Cases appear here the moment a student locks their shortlist." />
      ) : (
        <ul className="space-y-2">
          {cases.map((c) => (
            <li key={c.id}>
              <Link href={`/operations/cases/${c.id}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 hover:border-navy">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{c.name}</p>
                  <p className="text-xs text-muted">{c.source} · {c.locked} programmes · {c.docs} documents · locked {new Date(c.at).toLocaleDateString()}</p>
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
