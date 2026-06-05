import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");
  const settings = await getSettings();

  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo
            companyName={settings.companyName}
            logoText={settings.logoText}
            logoUrl={settings.logoUrl}
          />
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-navy">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your company settings and contact numbers.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Protected area. All changes are scoped to your organisation.
        </p>
      </div>
    </div>
  );
}
