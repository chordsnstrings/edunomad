import type { Metadata } from "next";
import { StaffLogin } from "@/components/auth/StaffLogin";

export const metadata: Metadata = { title: "Operations sign in", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function OperationsLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
      <StaffLogin redirectTo="/operations" title="Operations sign in" />
    </div>
  );
}
