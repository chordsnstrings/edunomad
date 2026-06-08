"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, ListChecks, Route, MessageCircle } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

const TABS = [
  { href: "/app", icon: Home, key: "nav.home" },
  { href: "/app/activity", icon: Bell, key: "nav.activity" },
  { href: "/app/shortlist", icon: ListChecks, key: "nav.shortlist" },
  { href: "/app/journey", icon: Route, key: "nav.journey" },
  { href: "/app/messages", icon: MessageCircle, key: "nav.messages" },
];

export function StudentNav() {
  const path = usePathname();
  const t = useT();
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white">
      <div className="mx-auto flex max-w-md">
        {TABS.map((tab) => {
          const active = path === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs ${active ? "text-navy" : "text-muted"}`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-gold-600" : ""}`} />
              {t(tab.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
