import { StudentNav } from "@/components/app/StudentNav";
import { PullToRefresh } from "@/components/app/PullToRefresh";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="main" className="pb-nav min-h-screen bg-white">
      <PullToRefresh />
      {children}
      <StudentNav />
    </div>
  );
}
