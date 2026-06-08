import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Logo } from "@/components/ui/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  // Block the dashboard until 2FA is enrolled (mandatory roles) and verified.
  if (!session.tfa) redirect("/admin/2fa");
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-subtle">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo
              companyName={settings.companyName}
              logoText={settings.logoText}
              logoUrl={settings.logoUrl}
            />
            <span className="hidden rounded-full bg-subtle px-2.5 py-1 text-xs font-semibold text-muted sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink/75 hover:bg-subtle hover:text-navy sm:inline-flex"
            >
              View site <ExternalLink className="h-4 w-4" />
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink/80 hover:bg-subtle"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="border-t border-line px-3 py-2 lg:hidden">
          <AdminNav orientation="horizontal" />
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:py-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <AdminNav />
            <p className="mt-6 px-3 text-xs leading-relaxed text-muted">
              Signed in as
              <br />
              <span className="font-medium text-ink">{session.email}</span>
            </p>
          </div>
        </aside>
        <main id="main" className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
