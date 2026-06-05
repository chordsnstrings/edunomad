import type { Metadata } from "next";
import { StaffLogin } from "@/components/auth/StaffLogin";

export const metadata: Metadata = { title: "Parent sign-in", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function ParentLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
      <StaffLogin redirectTo="/parent" title="Parent sign-in" />
    </div>
  );
}
