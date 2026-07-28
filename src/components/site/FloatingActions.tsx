"use client";

import { Phone, MessageCircle } from "lucide-react";
import { telHref, whatsappHref } from "@/lib/utils";
import type { ResolvedContact, SiteSettings } from "@/lib/settings";
import { useVisitorContact } from "./VisitorContact";

/**
 * Sticky WhatsApp + Call buttons. Renders the default numbers on the server
 * (correct for crawlers and no-JS) and swaps in the visitor's per-country
 * numbers after hydration. Sits above the iOS home indicator.
 */
export function FloatingActions({
  settings,
  contact: defaultContact,
}: {
  settings: SiteSettings;
  contact: ResolvedContact;
}) {
  const contact = useVisitorContact(defaultContact)?.contact ?? defaultContact;
  if (!settings.showFloatingWhatsapp && !settings.showFloatingCall) return null;

  return (
    <div className="bottom-safe fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6">
      {settings.showFloatingCall && (
        <a
          href={telHref(contact.phone)}
          aria-label={`Call ${settings.companyName}`}
          className="group inline-flex min-h-[52px] items-center gap-2 rounded-full border border-line bg-white px-3 font-semibold text-navy shadow-sm transition-transform hover:scale-[1.03] sm:px-4"
        >
          <Phone className="h-5 w-5" strokeWidth={2} />
          <span className="hidden text-sm sm:inline">Call</span>
        </a>
      )}
      {settings.showFloatingWhatsapp && (
        <a
          href={whatsappHref(
            contact.whatsapp,
            `Hi ${settings.companyName}, I'd like help applying to study abroad.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Message ${settings.companyName} on WhatsApp`}
          className="inline-flex h-14 min-h-[56px] items-center gap-2 rounded-full bg-[#25D366] px-4 font-semibold text-white shadow-sm shadow-black/10 transition-transform hover:scale-[1.03]"
        >
          <MessageCircle className="h-6 w-6" strokeWidth={2} />
          <span className="hidden text-sm sm:inline">WhatsApp us</span>
        </a>
      )}
    </div>
  );
}
