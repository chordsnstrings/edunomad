import type { Metadata } from "next";
import { getTranslator } from "@/i18n";
import { getUserLocale } from "@/i18n/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireParent } from "@/lib/parent";
import { escalateAction } from "./actions";

export const metadata: Metadata = { title: "Talk to a manager", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EscalatePage() {
  const t = getTranslator(await getUserLocale());
  await requireParent();
  return (
    <div>
      <Link href="/parent" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{t("parent.escalate.title")}</h1>
      <p className="mb-4 text-sm text-muted">A Counsellor Manager will reach out. Tell us what you&apos;d like to discuss.</p>
      <form action={escalateAction} className="space-y-2">
        <textarea name="reason" rows={4} required placeholder={t("parent.escalate.placeholder")} aria-label={t("parent.escalate.placeholder")} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy" />
        <button className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">{t("parent.escalate.submit")}</button>
      </form>
    </div>
  );
}
