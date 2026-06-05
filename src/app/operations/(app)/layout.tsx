import Link from "next/link";
import { LogOut, ClipboardList } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { opsLogoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function OperationsLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStaff(["operations_team", "operations_manager"]);
  return (
    <div className="min-h-screen bg-subtle">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-navy">
            <ClipboardList className="h-5 w-5 text-gold-500" /> EduNomad
            <span className="rounded-full bg-subtle px-2 py-0.5 text-xs font-medium text-muted">
              {session.role === "operations_manager" ? "Ops Manager" : "Operations"}
            </span>
            <nav className="ml-2 flex gap-1 text-sm font-medium">
              <Link href="/operations" className="rounded-lg px-2 py-1 text-ink/70 hover:bg-subtle">Queue</Link>
              <Link href="/operations/replies" className="rounded-lg px-2 py-1 text-ink/70 hover:bg-subtle">Replies</Link>
              {session.role === "operations_manager" && (
                <Link href="/operations/approvals" className="rounded-lg px-2 py-1 text-ink/70 hover:bg-subtle">Approvals</Link>
              )}
            </nav>
          </div>
          <form action={opsLogoutAction}>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink/80 hover:bg-subtle">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
