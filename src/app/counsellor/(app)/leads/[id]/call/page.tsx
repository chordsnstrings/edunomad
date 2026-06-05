import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { Dialer } from "@/components/counsellor/Dialer";
import { SopScriptPanel } from "@/components/counsellor/SopScriptPanel";

export const metadata: Metadata = { title: "Call", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) notFound();
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) redirect("/counsellor");

  return (
    <div>
      <Link href={`/counsellor/leads/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Lead
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Call</h1>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Dialer studentId={id} phone={student.phone} studentName={student.fullName ?? student.phone} />
        <SopScriptPanel firstCall />
      </div>
    </div>
  );
}
