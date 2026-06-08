import type { Metadata } from "next";
import { requireStudent } from "@/lib/require-student";
import { ActivityFeed } from "@/components/app/ActivityFeed";
import { getTranslator } from "@/i18n";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Activity", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const { student } = await requireStudent();
  const t = getTranslator(student.language as Locale);
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-navy">{t("nav.activity")}</h1>
      <ActivityFeed />
    </div>
  );
}
