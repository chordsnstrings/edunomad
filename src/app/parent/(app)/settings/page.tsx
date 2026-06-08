import type { Metadata } from "next";
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
  await requireParent();
  const locale = await detectLocale();
  return (
    <div>
      <Link href="/parent" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="mt-3 mb-4 text-xl font-semibold text-navy">Settings</h1>
      <div className="space-y-5">
        <section>
          <p className="mb-2 text-sm font-semibold text-navy">Language</p>
          <LanguageSwitcher current={locale} />
        </section>
        <section>
          <p className="mb-2 text-sm font-semibold text-navy">Notifications</p>
          <PushToggle />
        </section>
        <section>
          <p className="mb-2 text-sm font-semibold text-navy">App lock (PIN)</p>
          <AppLockSettings />
        </section>
        <section>
          <p className="mb-2 text-sm font-semibold text-navy">Accessibility</p>
          <FontScaleToggle />
        </section>
        <section className="flex gap-2">
          <Link href="/parent/escalate" className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-navy hover:bg-subtle">Talk to a manager</Link>
          <Link href="/parent/complaint" className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-navy hover:bg-subtle">File a complaint</Link>
        </section>
      </div>
    </div>
  );
}
