import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { CountrySwitcher } from "./CountrySwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import type { SiteSettings } from "@/lib/settings";

const NAV = [
  { label: "Guides", href: "/guides" },
  { label: "Why EduNomad", href: "/#features" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Journey", href: "/#journey" },
  { label: "FAQ", href: "/#faq" },
];

/**
 * Static header. Country and locale are per-visitor state, so the switchers and
 * the WhatsApp link resolve them on the client — keeping this subtree free of
 * cookies()/headers() so the public site stays statically renderable.
 */
export function Header({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link href="/" aria-label={`${settings.companyName} home`}>
          <Logo
            companyName={settings.companyName}
            logoText={settings.logoText}
            logoUrl={settings.logoUrl}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-navy"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <CountrySwitcher />
          <Link
            href="/#contact"
            className={buttonClasses("primary", "sm", "hidden lg:inline-flex")}
          >
            Get started
          </Link>
          <MobileNav items={NAV} companyName={settings.companyName} />
        </div>
      </Container>
    </header>
  );
}
