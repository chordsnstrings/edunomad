"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { whatsappHref } from "@/lib/utils";

type NavItem = { label: string; href: string };

export function MobileNav({
  items,
  whatsapp,
  companyName,
}: {
  items: NavItem[];
  whatsapp: string;
  companyName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid h-11 w-11 place-items-center rounded-lg border border-line text-navy hover:bg-subtle"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-navy/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 top-0 rounded-b-2xl border-b border-line bg-white p-5 pb-7">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-lg border border-line text-navy hover:bg-subtle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-3 flex flex-col">
              {items.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-subtle"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid gap-2.5">
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className={buttonClasses("gold", "lg", "w-full")}
              >
                Get started
              </Link>
              <a
                href={whatsappHref(
                  whatsapp,
                  `Hi ${companyName}, I'd like help applying to study abroad.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("secondary", "lg", "w-full")}
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
