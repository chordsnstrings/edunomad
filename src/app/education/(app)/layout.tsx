import { LineChart } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { educationLogoutAction } from "./actions";
import { StaffHeader } from "@/components/staff/StaffHeader";

export const dynamic = "force-dynamic";

export default async function EducationLayout({ children }: { children: React.ReactNode }) {
  await requireStaff(["education_manager"], "/education/login");
  const nav = [
    { href: "/education", label: "KPIs" },
    { href: "/education/escalations", label: "Escalations" },
    { href: "/education/partners", label: "Partners" },
  ];
  return (
    <div className="min-h-screen bg-subtle">
      <StaffHeader
        Icon={LineChart}
        title="EduNomad"
        badge="Education Mgr"
        nav={nav}
        logoutAction={educationLogoutAction}
        maxW="max-w-4xl"
      />
      <main id="main" className="mx-auto max-w-4xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
