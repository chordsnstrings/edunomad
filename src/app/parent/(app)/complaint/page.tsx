import type { Metadata } from "next";
import { getTranslator } from "@/i18n";
import { getUserLocale } from "@/i18n/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireParent } from "@/lib/parent";
import { fileComplaintAction } from "./actions";

export const metadata: Metadata = { title: "File a complaint", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ComplaintPage() {
  const t = getTranslator(await getUserLocale());
  await requireParent();
  return (
    <div>
      <Link href="/parent" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{t("parent.complaint.title")}</h1>
      <p className="mb-4 text-sm text-muted">{t("parent.complaint.note")}</p>
      <form action={fileComplaintAction} className="space-y-2">
        <textarea name="body" rows={5} required placeholder={t("parent.complaint.placeholder")} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy" />
        <button className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">{t("parent.complaint.submit")}</button>
      </form>
    </div>
  );
}
