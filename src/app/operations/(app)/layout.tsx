import { ClipboardList } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { opsLogoutAction } from "./actions";
import { StaffHeader } from "@/components/staff/StaffHeader";

export const dynamic = "force-dynamic";

export default async function OperationsLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStaff(["operations_team", "operations_manager"]);
  const isManager = session.role === "operations_manager";
  const nav = [
    { href: "/operations", label: "Queue" },
    { href: "/operations/replies", label: "Replies" },
    { href: "/operations/sla", label: "SLA" },
    { href: "/operations/forms", label: "Forms" },
    { href: "/operations/visa-status", label: "Visa status" },
    ...(isManager
      ? [
          { href: "/operations/approvals", label: "Approvals" },
          { href: "/operations/visa-audit", label: "Visa audit" },
        ]
      : []),
  ];
  return (
    <div className="min-h-screen bg-subtle">
      <StaffHeader
        Icon={ClipboardList}
        title="EduNomad"
        badge={isManager ? "Ops Manager" : "Operations"}
        nav={nav}
        logoutAction={opsLogoutAction}
        maxW="max-w-4xl"
      />
      <main id="main" className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
