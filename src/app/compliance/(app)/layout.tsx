import { ShieldCheck } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { complianceLogoutAction } from "./actions";
import { StaffHeader } from "@/components/staff/StaffHeader";

export const dynamic = "force-dynamic";

export default async function ComplianceLayout({ children }: { children: React.ReactNode }) {
  await requireStaff(["compliance"], "/compliance/login");
  const nav = [
    { href: "/compliance", label: "Sign-off" },
    { href: "/compliance/bulletins", label: "Bulletins" },
  ];
  return (
    <div className="min-h-screen bg-subtle">
      <StaffHeader
        Icon={ShieldCheck}
        title="EduNomad"
        badge="Compliance"
        nav={nav}
        logoutAction={complianceLogoutAction}
        maxW="max-w-4xl"
      />
      <main id="main" className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
