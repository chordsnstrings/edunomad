"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { COUNTRY_COOKIE } from "@/lib/cookie-names";
import type { ResolvedContact } from "@/lib/settings";

export type CountryOption = {
  countryCode: string;
  countryName: string;
  displayName: string;
  phone: string;
  whatsapp: string;
};

type Ctx = {
  contact: ResolvedContact;
  code: string;
  isOverride: boolean;
  countries: CountryOption[];
  choose: (code: string) => void;
};

const VisitorContactContext = createContext<Ctx | null>(null);

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  return document.cookie.match(`(?:^|; )${name}=([^;]*)`)?.[1] ?? "";
}

/**
 * Resolves the visitor's country on the CLIENT.
 *
 * The public site is statically rendered (so the SEO pages can be CDN-cached),
 * which means the server can no longer read cookies/geo headers during render.
 * The server emits the default contact — correct HTML for crawlers and for
 * no-JS visitors — and this provider swaps in the country-specific numbers after
 * hydration: cookie override first, then a one-off /api/geo call.
 */
export function VisitorContactProvider({
  defaultContact,
  countries,
  children,
}: {
  defaultContact: ResolvedContact;
  countries: CountryOption[];
  children: React.ReactNode;
}) {
  const [code, setCode] = useState("");
  const [isOverride, setIsOverride] = useState(false);

  useEffect(() => {
    const override = readCookie(COUNTRY_COOKIE);
    if (override) {
      setCode(override.toUpperCase());
      setIsOverride(true);
      return;
    }
    let cancelled = false;
    fetch("/api/geo")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { code?: string } | null) => {
        if (!cancelled && d?.code) setCode(d.code.toUpperCase());
      })
      .catch(() => {
        /* geo is a nicety — fall back to the default contact */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const choose = useCallback((next: string) => {
    const value = next.toUpperCase();
    // Year-long, same-site cookie — mirrors what the old server action set.
    document.cookie = next
      ? `${COUNTRY_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
      : `${COUNTRY_COOKIE}=; path=/; max-age=0; samesite=lax`;
    setCode(value);
    setIsOverride(!!next);
  }, []);

  const contact = useMemo<ResolvedContact>(() => {
    if (!code) return defaultContact;
    const match = countries.find((c) => c.countryCode === code);
    if (!match) return defaultContact;
    return {
      phone: match.phone,
      whatsapp: match.whatsapp,
      countryCode: match.countryCode,
      countryName: match.countryName,
      displayName: match.displayName,
      source: "country",
    };
  }, [code, countries, defaultContact]);

  const value = useMemo<Ctx>(
    () => ({ contact, code: contact.countryCode, isOverride, countries, choose }),
    [contact, isOverride, countries, choose],
  );

  return (
    <VisitorContactContext.Provider value={value}>
      {children}
    </VisitorContactContext.Provider>
  );
}

/**
 * WhatsApp link + number that follows the visitor's country. Lets otherwise
 * server-rendered chrome (e.g. the footer) show a localised number without the
 * whole component becoming client-side.
 */
export function VisitorWhatsAppLink({
  defaultWhatsapp,
  className,
  children,
}: {
  defaultWhatsapp: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const ctx = useContext(VisitorContactContext);
  const number = ctx?.contact.whatsapp || defaultWhatsapp;
  const href = `https://wa.me/${number.replace(/[^\d]/g, "")}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {number}
    </a>
  );
}

/** Resolved contact for the current visitor. Safe outside the provider (falls back). */
export function useVisitorContact(fallback?: ResolvedContact): Ctx | null {
  const ctx = useContext(VisitorContactContext);
  if (ctx) return ctx;
  if (!fallback) return null;
  return {
    contact: fallback,
    code: fallback.countryCode,
    isOverride: false,
    countries: [],
    choose: () => {},
  };
}
