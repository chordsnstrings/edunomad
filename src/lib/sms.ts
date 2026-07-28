// SMS via Twilio (fallback channel). Mocked in dev. PII (phone) is masked in
// logs and message bodies are never logged (CLAUDE.md §11).

import { fetchWithTimeout } from "./http";

export function maskPhone(phone: string): string {
  return phone.replace(/\d(?=\d{2})/g, "•");
}

export type SmsResult = { ok: boolean; channel: "sms"; mock: boolean };

export async function sendSms(phone: string, message: string): Promise<SmsResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (sid && token && from) {
    try {
      const res = await fetchWithTimeout(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ To: phone, From: from, Body: message }),
        },
      );
      return { ok: res.ok, channel: "sms", mock: false };
    } catch {
      return { ok: false, channel: "sms", mock: false };
    }
  }

  // Dev mock — log the channel + masked recipient + length only (never the body).
  console.info(`[sms:mock] -> ${maskPhone(phone)} (${message.length} chars)`);
  return { ok: true, channel: "sms", mock: true };
}
