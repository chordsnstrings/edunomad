import type { Metadata } from "next";
import { SignupFlow } from "@/components/auth/SignupFlow";

export const metadata: Metadata = { title: "Sign up", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
      <SignupFlow />
    </div>
  );
}
