import type { Metadata } from "next";
import { getUserLocale } from "@/i18n/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStudent } from "@/lib/require-student";
import { CA_CHECKLIST } from "@/lib/reference/document-checklist";
import { DocumentUpload } from "@/components/app/DocumentUpload";

export const metadata: Metadata = { title: "Upload document", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  await requireStudent();
  const { type } = await params;
  const doc = CA_CHECKLIST.find((d) => d.documentType === type);
  if (!doc) notFound();
  const lang = (await getUserLocale()) as "en" | "bn" | "hi" | "ne";

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <Link href="/app/documents" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Documents
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{doc.label}</h1>
      <p className="mt-1 text-sm leading-relaxed text-muted">{doc.notes[lang] || doc.notes.en}</p>
      <div className="mt-5">
        <DocumentUpload documentType={type} />
      </div>
    </div>
  );
}
