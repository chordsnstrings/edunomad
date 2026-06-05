import { StudentNav } from "@/components/app/StudentNav";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-16">
      {children}
      <StudentNav />
    </div>
  );
}
