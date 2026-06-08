import type { Metadata } from "next";
import { StaffLogin } from "@/components/auth/StaffLogin";

export const metadata: Metadata = { title: "Finance sign in", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function FinanceLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
      <StaffLogin redirectTo="/finance" title="Finance sign in" />
    </div>
  );
}
