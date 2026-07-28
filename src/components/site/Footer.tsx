import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VisitorWhatsAppLink } from "./VisitorContact";
import { Logo } from "@/components/ui/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  XIcon,
} from "./SocialIcons";
import type { ResolvedContact, SiteSettings } from "@/lib/settings";

type IconType = (props: { className?: string }) => React.ReactElement;

const NAV = [
  { label: "Why EduNomad", href: "/#features" },
  { label: "Destinations", href: "/#destinations" },
  { label: "The journey", href: "/#journey" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function Footer({
  settings,
  contact,
}: {
  settings: SiteSettings;
  contact: ResolvedContact;
}) {
  const socials: { href: string | null; label: string; Icon: IconType }[] = [
    { href: settings.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { href: settings.instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { href: settings.linkedinUrl, label: "LinkedIn", Icon: LinkedinIcon },
    { href: settings.youtubeUrl, label: "YouTube", Icon: YoutubeIcon },
    { href: settings.twitterUrl, label: "X / Twitter", Icon: XIcon },
  ];

  return (
    <footer className="border-t border-line bg-white">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo
              companyName={settings.companyName}
              logoText={settings.logoText}
              logoUrl={settings.logoUrl}
            />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {settings.shortDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socials
                .filter((s) => s.href)
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-line text-navy transition-colors hover:border-navy/30 hover:bg-subtle"
                  >
                    <s.Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Explore
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-ink/80 transition-colors hover:text-navy"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 text-ink/80 hover:text-navy"
                >
                  <Mail className="h-4 w-4 text-gold-600" /> {settings.email}
                </a>
              </li>
              <li>
                <VisitorWhatsAppLink
                  defaultWhatsapp={contact.whatsapp}
                  className="inline-flex items-center gap-2 text-ink/80 hover:text-navy"
                >
                  <MessageCircle className="h-4 w-4 text-gold-600" />{" "}
                </VisitorWhatsAppLink>
              </li>
              <li className="pt-1">
                <Link
                  href="/admin"
                  className="text-xs text-muted hover:text-navy"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.legalName || settings.companyName}. All
            rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-navy">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-navy">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
