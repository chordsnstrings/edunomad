import { Wallet } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { financeLogoutAction } from "./actions";
import { StaffHeader } from "@/components/staff/StaffHeader";

export const dynamic = "force-dynamic";

export default async function FinanceLayout({ children }: { children: React.ReactNode }) {
  await requireStaff(["finance"], "/finance/login");
  const nav = [
    { href: "/finance", label: "Overview" },
    { href: "/finance/payments", label: "Payments" },
    { href: "/finance/commissions", label: "Commissions" },
    { href: "/finance/payouts", label: "Payouts" },
    { href: "/finance/refunds", label: "Refunds" },
  ];
  return (
    <div className="min-h-screen bg-subtle">
      <StaffHeader
        Icon={Wallet}
        title="EduNomad"
        badge="Finance"
        nav={nav}
        logoutAction={financeLogoutAction}
        maxW="max-w-4xl"
      />
      <main id="main" className="mx-auto max-w-4xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
