import webpush from "web-push";
import { prisma } from "./db";
import { renderEventTemplate } from "./event-templates";
import { sendSms } from "./sms";
import type { Locale } from "../i18n/config";

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@edunomad.app";

let vapidReady = false;
function ensureVapid(): boolean {
  if (vapidReady) return true;
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return false;
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
  vapidReady = true;
  return true;
}

export function getVapidPublicKey(): string | null {
  return VAPID_PUBLIC ?? null;
}

// Approximate a user's local timezone from their UI locale (source corridors).
export const LOCALE_TIMEZONE: Record<Locale, string> = {
  en: "Asia/Dhaka",
  bn: "Asia/Dhaka",
  hi: "Asia/Kolkata",
  ne: "Asia/Kathmandu",
};

export function localHour(date: Date, timeZone: string): number {
  const s = new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone }).format(date);
  return Number(s) % 24;
}

/** Quiet hours default to 22:00–08:00 local (CLAUDE.md §7). */
export function isQuietHours(date: Date, timeZone: string, startHour = 22, endHour = 8): boolean {
  const h = localHour(date, timeZone);
  return h >= startHour || h < endHour;
}

export async function saveSubscription(
  userId: string,
  sub: { endpoint: string; keys: { p256dh: string; auth: string } },
) {
  return prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    create: { userId, endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    update: { userId, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
  });
}

export async function removeSubscription(endpoint: string) {
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
}

export type PushRecipient = { userId: string; locale: Locale; phone?: string; critical?: boolean };
export type DispatchResult = {
  delivered: number;
  quietSkipped: number;
  fellBack: number;
  inAppOnly: boolean;
};

/**
 * Deliver an event to recipients via Web Push when channels.push is true.
 * Quiet hours suppress non-critical pushes; failed/absent delivery falls back to
 * SMS (when a phone is known) or in-app only. Copy comes from event templates.
 */
export async function dispatchPushForEvent(
  event: { type: string; channels?: Record<string, boolean> | null; payload?: Record<string, unknown> | null },
  recipients: PushRecipient[],
  now: Date = new Date(),
): Promise<DispatchResult> {
  const result: DispatchResult = { delivered: 0, quietSkipped: 0, fellBack: 0, inAppOnly: !ensureVapid() };
  if (event.channels?.push !== true) return result;

  for (const r of recipients) {
    const tz = LOCALE_TIMEZONE[r.locale] ?? "UTC";
    if (!r.critical && isQuietHours(now, tz)) {
      result.quietSkipped++;
      continue;
    }
    const body = renderEventTemplate({ type: event.type, payload: event.payload ?? null }, r.locale);

    let pushedAny = false;
    if (ensureVapid()) {
      const subs = await prisma.pushSubscription.findMany({ where: { userId: r.userId } });
      for (const s of subs) {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            JSON.stringify({ title: "EduNomad", body }),
          );
          result.delivered++;
          pushedAny = true;
        } catch (err) {
          // 404/410 mean the browser dropped the subscription: delete it rather
          // than retrying it forever on every future dispatch.
          const status = (err as { statusCode?: number })?.statusCode;
          if (status === 404 || status === 410) {
            await prisma.pushSubscription.deleteMany({ where: { endpoint: s.endpoint } }).catch(() => {});
          }
        }
      }
    }
    if (!pushedAny) {
      if (r.phone) {
        await sendSms(r.phone, body);
        result.fellBack++;
      }
      // else: in-app only (no transport)
    }
  }
  return result;
}
