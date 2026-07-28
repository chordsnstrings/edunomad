import type { Metadata } from "next";
import { requireStudent } from "@/lib/require-student";
import { ActivityFeed } from "@/components/app/ActivityFeed";
import { getTranslator } from "@/i18n";
import { getUserLocale } from "@/i18n/server";

export const metadata: Metadata = { title: "Activity", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  await requireStudent();
  const t = getTranslator(await getUserLocale());
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-navy">{t("nav.activity")}</h1>
      <ActivityFeed />
    </div>
  );
}
