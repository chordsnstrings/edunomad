import type { Metadata } from "next";
import { getTranslator } from "@/i18n";
import { getUserLocale } from "@/i18n/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireParent } from "@/lib/parent";
import { detectLocale } from "@/i18n/locale";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { PushToggle } from "@/components/pwa/PushToggle";
import { AppLockSettings } from "@/components/app/AppLock";
import { FontScaleToggle } from "@/components/a11y/FontScaleToggle";

export const metadata: Metadata = { title: "Settings", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ParentSettings() {
  const t = getTranslator(await getUserLocale());
  await requireParent();
  const locale = await detectLocale();
  return (
    <div>
      <Link href="/parent" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="mt-3 mb-4 text-xl font-semibold text-navy">{t("parent.settings.title")}</h1>
      <div className="space-y-5">
        <section>
          <p className="mb-2 text-sm font-semibold text-navy">{t("parent.settings.language")}</p>
          <LanguageSwitcher current={locale} />
        </section>
        <section>
          <p className="mb-2 text-sm font-semibold text-navy">{t("parent.settings.notifications")}</p>
          <PushToggle />
        </section>
        <section>
          <p className="mb-2 text-sm font-semibold text-navy">{t("parent.settings.app_lock")}</p>
          <AppLockSettings />
        </section>
        <section>
          <p className="mb-2 text-sm font-semibold text-navy">{t("parent.settings.accessibility")}</p>
          <FontScaleToggle />
        </section>
        <section className="flex gap-2">
          <Link href="/parent/escalate" className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-navy hover:bg-subtle tap">{t("parent.dashboard.talk_to_manager")}</Link>
          <Link href="/parent/complaint" className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-navy hover:bg-subtle tap">{t("parent.complaint.title")}</Link>
        </section>
      </div>
    </div>
  );
}
