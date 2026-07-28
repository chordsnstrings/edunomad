import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { rubricFor } from "@/lib/reference/qa-rubric";
import { QaRubric } from "@/components/operations/QaRubric";

export const metadata: Metadata = { title: "Document QA", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string; docId: string }> }) {
  await requireStaff(["operations_team", "operations_manager"], "/operations/login");
  const { id, docId } = await params;
  const doc = await prisma.document.findUnique({ where: { id: docId } });
  if (!doc || doc.studentId !== id) notFound();
  const items = rubricFor(doc.documentType);
  const versions = await prisma.document.findMany({ where: { studentId: id, documentType: doc.documentType }, orderBy: { version: "desc" } });

  return (
    <div>
      <Link href={`/operations/cases/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Case
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{doc.documentType}</h1>
      <p className="mb-4 text-sm text-muted">Version {doc.version} · current status: {doc.status}</p>
      {versions.length > 1 && (
        <div className="mb-4 rounded-xl border border-line bg-white p-3">
          <p className="mb-1.5 text-xs font-semibold text-navy">Version history ({versions.length})</p>
          <ul className="space-y-1 text-xs text-muted">
            {versions.map((v) => (
              <li key={v.id} className={v.id === docId ? "font-semibold text-navy" : ""}>
                v{v.version} · {v.status} · {v.createdAt.toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
      <QaRubric documentId={docId} items={items} />
    </div>
  );
}
