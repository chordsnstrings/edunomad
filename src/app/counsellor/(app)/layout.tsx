import { LogOut, Users } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { staffLogoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CounsellorLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  return (
    <div className="min-h-screen bg-subtle">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-navy">
            <Users className="h-5 w-5 text-gold-500" /> EduNomad
            <span className="rounded-full bg-subtle px-2 py-0.5 text-xs font-medium text-muted">
              {session.role === "counsellor_manager" ? "Manager" : "Counsellor"}
            </span>
          </div>
          <form action={staffLogoutAction}>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink/80 hover:bg-subtle">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
