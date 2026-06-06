import { Users } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { staffLogoutAction } from "./actions";
import { StaffHeader } from "@/components/staff/StaffHeader";

export const dynamic = "force-dynamic";

export default async function CounsellorLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const isManager = session.role === "counsellor_manager";
  const nav = [
    { href: "/counsellor", label: "Inbox" },
    { href: "/counsellor/my-stats", label: "My stats" },
    ...(isManager
      ? [
          { href: "/counsellor/team", label: "Team" },
          { href: "/counsellor/standup", label: "Standup" },
          { href: "/counsellor/escalations", label: "Escalations" },
          { href: "/counsellor/refunds", label: "Refunds" },
          { href: "/counsellor/qa", label: "QA" },
          { href: "/counsellor/manage", label: "Manage" },
        ]
      : []),
  ];
  return (
    <div className="min-h-screen bg-subtle">
      <StaffHeader
        Icon={Users}
        title="EduNomad"
        badge={isManager ? "Manager" : "Counsellor"}
        nav={nav}
        logoutAction={staffLogoutAction}
        maxW="max-w-3xl"
      />
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
