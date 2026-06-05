"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Route, MessageCircle } from "lucide-react";

const TABS = [
  { href: "/app", icon: Home, label: "Home" },
  { href: "/app/activity", icon: Bell, label: "Activity" },
  { href: "/app/journey", icon: Route, label: "Journey" },
  { href: "/app/messages", icon: MessageCircle, label: "Messages" },
];

export function StudentNav() {
  const path = usePathname();
  return (
    <nav className="bottom-safe fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white">
      <div className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const active = path === t.href;
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs ${active ? "text-navy" : "text-muted"}`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-gold-600" : ""}`} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
