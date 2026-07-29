import Link from "next/link";
import { LogOut } from "lucide-react";

/**
 * Shared staff header (counsellor / operations / compliance). Mobile-first:
 * a compact brand + sign-out row, with the nav on its own horizontally
 * scrollable row so it never overflows the viewport or clips the header at
 * small widths (the previous single-row header overflowed at 380px).
 */
export function StaffHeader({
  Icon,
  title,
  badge,
  nav,
  logoutAction,
  maxW = "max-w-4xl",
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge: string;
  nav: { href: string; label: string }[];
  logoutAction: () => void;
  maxW?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className={`mx-auto ${maxW} px-4`}>
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 font-semibold text-navy">
            <Icon className="h-5 w-5 shrink-0 text-gold-600" />
            <span className="truncate">{title}</span>
            <span className="shrink-0 rounded-full bg-subtle px-2 py-0.5 text-xs font-medium text-muted">
              {badge}
            </span>
          </div>
          <form action={logoutAction}>
            <button className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-ink/80 hover:bg-subtle">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
        {nav.length > 0 && (
          <nav
            aria-label={badge}
            className="-mx-4 flex gap-1 overflow-x-auto whitespace-nowrap px-4 pb-2.5 text-sm font-medium [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-ink/70 hover:bg-subtle tap"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
