import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { buttonClasses } from "@/components/ui/Button";
import { telHref, whatsappHref, flagEmoji } from "@/lib/utils";
import type { ResolvedContact, SiteSettings } from "@/lib/settings";

export function ContactSection({
  settings,
  contact,
}: {
  settings: SiteSettings;
  contact: ResolvedContact;
}) {
  const localised = contact.source === "country";
  return (
    <Section id="contact">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Talk to us"
            title={
              localised
                ? `Reach our ${contact.countryName} team`
                : "Reach our team"
            }
            intro="Tap WhatsApp or call — we'll show you exactly what to do next. No pressure, no jargon."
          />
          {localised && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-subtle px-3 py-1.5 text-xs font-medium text-muted">
              <span aria-hidden>{flagEmoji(contact.countryCode)}</span>
              Showing local numbers for {contact.countryName}. Change your region
              in the header.
            </p>
          )}

          <dl className="mt-8 space-y-5">
            <ContactRow icon={<Mail className="h-5 w-5" />} label="Email">
              <a
                href={`mailto:${settings.email}`}
                className="font-medium text-navy hover:text-gold-600"
              >
                {settings.email}
              </a>
            </ContactRow>
            {(settings.addressLine || settings.city) && (
              <ContactRow icon={<MapPin className="h-5 w-5" />} label="Office">
                <span className="text-ink">
                  {[settings.addressLine, settings.city, settings.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </ContactRow>
            )}
            {settings.businessHours && (
              <ContactRow icon={<Clock className="h-5 w-5" />} label="Hours">
                <span className="text-ink">{settings.businessHours}</span>
              </ContactRow>
            )}
          </dl>
        </div>

        {/* Big tappable contact card with the resolved per-country numbers */}
        <div className="rounded-2xl border border-line bg-navy p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">
            {contact.displayName || "Direct line"}
          </p>
          <div className="mt-5 space-y-3">
            <a
              href={whatsappHref(
                contact.whatsapp,
                `Hi ${settings.companyName}, I'd like to start my application.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses(
                "gold",
                "lg",
                "w-full justify-between text-base",
              )}
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </span>
              <span className="font-semibold">{contact.whatsapp}</span>
            </a>
            <a
              href={telHref(contact.phone)}
              className={buttonClasses(
                "secondary",
                "lg",
                "w-full justify-between border-white/20 bg-white/5 text-base text-white hover:border-white/30 hover:bg-white/10",
              )}
            >
              <span className="inline-flex items-center gap-2">
                <Phone className="h-5 w-5" /> Call
              </span>
              <span className="font-semibold">{contact.phone}</span>
            </a>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-white/55">
            Your message goes to a real counsellor. We never charge to talk, and
            we never promise visas or scholarships we can&apos;t deliver.
          </p>
        </div>
      </div>
    </Section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-subtle text-navy">
        {icon}
      </span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  );
}
