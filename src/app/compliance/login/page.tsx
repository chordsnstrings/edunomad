import type { Metadata } from "next";
import { StaffLogin } from "@/components/auth/StaffLogin";

export const metadata: Metadata = { title: "Compliance sign-in", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function ComplianceLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
      <StaffLogin redirectTo="/compliance" title="Compliance sign-in" />
    </div>
  );
}
