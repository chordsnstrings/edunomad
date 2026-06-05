import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { WHATSAPP_TEMPLATES } from "@/lib/whatsapp-templates";
import { getTemplateStatus } from "@/lib/whatsapp";
import { WhatsAppComposer } from "@/components/counsellor/WhatsAppComposer";

export const metadata: Metadata = { title: "WhatsApp", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) notFound();
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) redirect("/counsellor");

  const counsellor = student.assignedCounsellorId
    ? await prisma.counsellorProfile.findUnique({ where: { userId: student.assignedCounsellorId } })
    : null;

  const templates = Object.values(WHATSAPP_TEMPLATES)
    .map((t) => ({
      id: t.id,
      body: t.body,
      variables: t.variables,
      approvedInLang: getTemplateStatus(t.id, student.language) === "approved",
    }))
    .filter((t) => t.approvedInLang || getTemplateStatus(t.id, "en") === "approved");

  const firstName = (student.fullName ?? "").split(" ")[0] || "there";
  const defaults = [firstName, counsellor?.fullName ?? "your counsellor"];

  return (
    <div>
      <Link href={`/counsellor/leads/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Lead
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Send WhatsApp</h1>
      <p className="mt-1 text-sm text-muted">
        Approved templates, prefilled from {student.fullName ?? "the student"}&apos;s record. Preview before sending.
      </p>
      <div className="mt-5 max-w-md">
        <WhatsAppComposer studentId={id} templates={templates} defaults={defaults} />
      </div>
    </div>
  );
}
