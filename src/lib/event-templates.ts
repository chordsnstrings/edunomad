import { IntlMessageFormat } from "intl-messageformat";
import { DEFAULT_LOCALE, type Locale } from "../i18n/config";

/**
 * Event → notification template catalog (seed). EN is the source of truth;
 * BN/HI/NE flow through the certified-translator pipeline and fall back to EN
 * until translated (CLAUDE.md §7). Variables use ICU `{var}` / plural syntax.
 */
export const EVENT_TEMPLATES: Record<string, Partial<Record<Locale, string>>> = {
  "student.signed_up": { en: "{name} joined EduNomad." },
  "counsellor.assigned": {
    en: "Your counsellor {counsellor} has been assigned.",
    bn: "আপনার কাউন্সেলর {counsellor} নিযুক্ত হয়েছেন।",
  },
  "counsellor.message_sent": { en: "{counsellor}: {preview}" },
  "document.requested": { en: "Please upload your {document_type}." },
  "document.approved": { en: "Your {document_type} was approved." },
  "document.rework_requested": {
    en: "Your {document_type} needs a small fix: {reason}",
  },
  "shortlist.locked": {
    en: "Your shortlist of {count, plural, one {# programme} other {# programmes}} is locked.",
  },
  "application.submitted": { en: "Your application to {university} was submitted." },
  "application.info_requested": {
    en: "{university} requested more information for your application.",
  },
  "offer.received": { en: "Offer received from {university}!" },
  "payment.invoice": { en: "Invoice ready: {purpose} — {amount} {currency}, due {due_date}." },
  "payment.received": { en: "Payment of {amount} {currency} received." },
  "visa.appointment_booked": { en: "Your VFS appointment is booked at {location} on {datetime}." },
  "visa.submitted": { en: "Visa application submitted to {authority}." },
  "visa.approved": { en: "Your visa is approved! Pre-departure begins." },
  "visa.decision": { en: "A visa decision has been received. Your counsellor will call you." },
};

const cache = new Map<string, IntlMessageFormat>();

function humanize(type: string) {
  return type.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Render an event into a localized string. Falls back to the EN template when
 * the target locale's template is empty/missing, and to a humanized type when
 * no template exists.
 */
export function renderEventTemplate(
  event: { type: string; payload?: Record<string, unknown> | null },
  locale: Locale,
): string {
  const entry = EVENT_TEMPLATES[event.type];
  const raw = entry?.[locale] || entry?.[DEFAULT_LOCALE];
  if (!raw) return humanize(event.type);
  const vars = (event.payload ?? {}) as Record<string, unknown>;
  const cacheKey = `${locale} ${raw}`;
  try {
    let f = cache.get(cacheKey);
    if (!f) {
      f = new IntlMessageFormat(raw, locale);
      cache.set(cacheKey, f);
    }
    return String(f.format(vars));
  } catch {
    return raw.replace(/\{(\w+)\}/g, (_, k: string) =>
      k in vars ? String(vars[k]) : `{${k}}`,
    );
  }
}
