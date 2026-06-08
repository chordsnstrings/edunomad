import { StudentNav } from "@/components/app/StudentNav";
import { PullToRefresh } from "@/components/app/PullToRefresh";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getUserLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const locale = await getUserLocale();
  return (
    <LocaleProvider locale={locale}>
      <div id="main" className="pb-nav min-h-screen bg-white">
        <PullToRefresh />
        {children}
        <StudentNav />
      </div>
    </LocaleProvider>
  );
}
