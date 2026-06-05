import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes, resolving conflicts (last wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a tel: href from a display phone number. */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** Build a wa.me link from a WhatsApp number, with an optional prefilled message. */
export function whatsappHref(number: string, message?: string) {
  const digits = number.replace(/[^\d]/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Regional-indicator flag emoji from an ISO-3166 alpha-2 code. */
export function flagEmoji(code: string) {
  const cc = (code || "").trim().toUpperCase();
  if (cc.length !== 2) return "🌐";
  return cc.replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0)),
  );
}
