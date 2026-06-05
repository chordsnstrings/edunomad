import type { Metadata } from "next";
import { requireStudent } from "@/lib/require-student";
import { ActivityFeed } from "@/components/app/ActivityFeed";

export const metadata: Metadata = { title: "Activity", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  await requireStudent();
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-navy">Activity</h1>
      <ActivityFeed />
    </div>
  );
}
