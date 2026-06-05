import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireStudent } from "@/lib/require-student";
import { getChecklistForStudent, getLatestDocuments } from "@/lib/documents";
import { STAGE_LABELS } from "@/lib/reference/document-checklist";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Documents", robots: { index: false } };
export const dynamic = "force-dynamic";

const BADGE: Record<string, string> = {
  needed: "bg-subtle text-muted",
  uploaded: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rework_requested: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};
const BADGE_LABEL: Record<string, string> = {
  needed: "Needed",
  uploaded: "Uploaded",
  under_review: "Under review",
  approved: "Approved",
  rework_requested: "Rework",
  rejected: "Rejected",
};

export default async function DocumentsPage() {
  const { student } = await requireStudent();
  const checklist = await getChecklistForStudent(student);
  const latest = await getLatestDocuments(student.id);
  const lang = student.language as "en" | "bn" | "hi" | "ne";

  if (checklist.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold text-navy">Documents</h1>
        <EmptyState title="Your checklist is being prepared" body="Once your shortlist is set, we'll generate a personalised document checklist here." />
      </div>
    );
  }

  const stages = [...new Set(checklist.map((d) => d.stage))];

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-3 text-xl font-semibold text-navy">Documents</h1>
      <div className="mb-4 flex gap-2">
        <Link href="/app/documents/photo" className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-navy hover:bg-subtle">Visa photo tool</Link>
        <Link href="/app/documents/sponsor" className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-navy hover:bg-subtle">Sponsor declaration</Link>
      </div>
      <div className="space-y-6">
        {stages.map((stage) => (
          <section key={stage}>
            <h2 className="mb-2 text-sm font-semibold text-muted">{STAGE_LABELS[stage]}</h2>
            <ul className="space-y-2">
              {checklist.filter((d) => d.stage === stage).map((d) => {
                const doc = latest.get(d.documentType);
                const status = doc?.status ?? "needed";
                return (
                  <li key={d.documentType}>
                    <Link href={`/app/documents/${d.documentType}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3.5 hover:border-navy">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-navy">{d.label}</p>
                          {!d.required && <span className="text-xs text-muted">optional</span>}
                        </div>
                        <p className="truncate text-xs text-muted">{d.notes[lang] || d.notes.en}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BADGE[status]}`}>{BADGE_LABEL[status]}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
