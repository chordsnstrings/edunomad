import { StudentNav } from "@/components/app/StudentNav";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-nav min-h-screen bg-white">
      {children}
      <StudentNav />
    </div>
  );
}
