import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireStudent } from "@/lib/require-student";
import { SponsorDeclaration } from "@/components/app/SponsorDeclaration";

export const metadata: Metadata = { title: "Sponsor declaration", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SponsorPage() {
  const { student } = await requireStudent();
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <Link href="/app/documents" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Documents</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Sponsor declaration</h1>
      <p className="mb-4 text-sm text-muted">Fill the form to generate a declaration, then print and upload it.</p>
      <SponsorDeclaration studentName={student.fullName ?? "the applicant"} />
    </div>
  );
}
