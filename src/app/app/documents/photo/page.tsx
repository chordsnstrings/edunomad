import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { PhotoCropper } from "@/components/app/PhotoCropper";

export const metadata: Metadata = { title: "Visa photo", robots: { index: false } };
export const dynamic = "force-dynamic";

const PHOTO_SPECS: Record<string, { w: number; h: number; label: string; bg: string }> = {
  CA: { w: 35, h: 45, label: "35×45mm", bg: "white / light" },
  UK: { w: 35, h: 45, label: "35×45mm", bg: "light grey / cream" },
  AU: { w: 35, h: 45, label: "35×45mm", bg: "white" },
  MY: { w: 35, h: 50, label: "35×50mm", bg: "white" },
};

export default async function PhotoPage() {
  const { student } = await requireStudent();
  const app = await prisma.application.findFirst({ where: { studentId: student.id, shortlistStatus: "locked" } });
  let dest = "CA";
  if (app) {
    const prog = await prisma.programme.findUnique({ where: { id: app.programmeId }, include: { institution: true } });
    if (prog) dest = prog.institution.country;
  }
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <Link href="/app/documents" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Documents</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Visa photo</h1>
      <p className="mb-4 text-sm text-muted">Cropped to the {dest} specification.</p>
      <PhotoCropper spec={PHOTO_SPECS[dest] ?? PHOTO_SPECS.CA} />
    </div>
  );
}
