import Link from "next/link";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { flagEmoji, whatsappHref } from "@/lib/utils";
import { DESTINATIONS, JOURNEY } from "@/lib/content";
import type { ResolvedContact, SiteSettings } from "@/lib/settings";

export function Hero({
  settings,
  contact,
}: {
  settings: SiteSettings;
  contact: ResolvedContact;
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* faint, flat gold hairline accent — no gradients (brand) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/40"
      />
      <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {settings.tagline}
          </span>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
            Study abroad,
            <br />
            <span className="text-gold">handled end to end.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {settings.shortDescription}
          </p>

          <div className="mt-8 flex flex-col gap-3 xs:flex-row">
            <Link
              href="#contact"
              className={buttonClasses("gold", "lg", "w-full xs:w-auto")}
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref(
                contact.whatsapp,
                `Hi ${settings.companyName}, I'd like help applying to study abroad.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses(
                "secondary",
                "lg",
                "w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 xs:w-auto",
              )}
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
            <span className="font-medium text-white/75">Trusted pathways to</span>
            {DESTINATIONS.map((d) => (
              <span key={d.code} className="inline-flex items-center gap-1.5">
                <span aria-hidden>{flagEmoji(d.code)}</span>
                {d.name}
              </span>
            ))}
          </div>
        </div>

        {/* Journey preview card — flat white, 1px rule */}
        <div className="relative">
          <div className="rounded-2xl border border-white/10 bg-white p-5 text-ink sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-navy">Your journey</p>
              <span className="rounded-full bg-gold-100 px-2.5 py-1 text-xs font-semibold text-gold-600">
                9 guided stages
              </span>
            </div>
            <ol className="mt-4 space-y-2.5">
              {JOURNEY.slice(0, 6).map((s, i) => {
                const done = i < 2;
                const active = i === 2;
                return (
                  <li key={s.stage} className="flex items-center gap-3">
                    <span
                      className={
                        done
                          ? "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-white"
                          : active
                            ? "grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-gold text-gold-600"
                            : "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-muted"
                      }
                    >
                      {done ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-semibold">{s.stage}</span>
                      )}
                    </span>
                    <span
                      className={
                        active
                          ? "text-sm font-semibold text-navy"
                          : "text-sm text-ink/80"
                      }
                    >
                      {s.name}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 border-t border-line pt-4 text-xs text-muted">
              … through to Visa &amp; Arrival — every step visible to you and
              your parents.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
