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
  await requireStaff(["operations_team", "operations_manager"]);
  const { id, docId } = await params;
  const doc = await prisma.document.findUnique({ where: { id: docId } });
  if (!doc || doc.studentId !== id) notFound();
  const items = rubricFor(doc.documentType);

  return (
    <div>
      <Link href={`/operations/cases/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Case
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{doc.documentType}</h1>
      <p className="mb-4 text-sm text-muted">Version {doc.version} · current status: {doc.status}</p>
      <QaRubric documentId={docId} items={items} />
    </div>
  );
}
