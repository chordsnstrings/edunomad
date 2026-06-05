"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Phone, BookText, ScrollText, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Company settings", href: "/admin/settings", icon: Building2 },
  { label: "Country numbers", href: "/admin/countries", icon: Phone },
  { label: "SOP CMS", href: "/admin/sop", icon: BookText },
  { label: "Audit log", href: "/admin/audit", icon: ScrollText },
  { label: "Incidents", href: "/admin/incidents", icon: ShieldAlert },
];

export function AdminNav({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        orientation === "vertical"
          ? "flex flex-col gap-1"
          : "flex gap-1 overflow-x-auto",
      )}
      aria-label="Admin"
    >
      {ITEMS.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-navy text-white"
                : "text-ink/75 hover:bg-white hover:text-navy",
            )}
          >
            <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
