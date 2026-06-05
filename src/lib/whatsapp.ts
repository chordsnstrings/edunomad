import { WHATSAPP_TEMPLATES } from "./whatsapp-templates";
import { sendSms, maskPhone } from "./sms";
import { type Locale } from "../i18n/config";

export type SendChannel = "whatsapp" | "sms" | "none";
export type SendResult = {
  ok: boolean;
  channel: SendChannel;
  mock: boolean;
  templateId: string;
};

export type ApprovalStatus = "approved" | "pending" | "rejected";

/** Per-template × language Meta approval status. EN is the source of truth
 *  (approved); other locales stay pending until translated + Meta-approved. */
const STATUS_OVERRIDES: Record<string, Partial<Record<Locale, ApprovalStatus>>> = {};

export function getTemplateStatus(id: string, locale: Locale): ApprovalStatus {
  if (!WHATSAPP_TEMPLATES[id]) return "rejected";
  return STATUS_OVERRIDES[id]?.[locale] ?? (locale === "en" ? "approved" : "pending");
}

/** Render a template body by substituting positional {{1}}, {{2}} variables. */
export function renderWhatsAppBody(templateId: string, variables: (string | number)[]): string {
  const t = WHATSAPP_TEMPLATES[templateId];
  if (!t) throw new Error(`Unknown WhatsApp template: ${templateId}`);
  return t.body.replace(/\{\{(\d+)\}\}/g, (_, n: string) =>
    String(variables[Number(n) - 1] ?? ""),
  );
}

/**
 * Send a WhatsApp template message. Uses the Cloud API when
 * WHATSAPP_CLOUD_API_TOKEN is set, otherwise a dev mock. Falls back to SMS when
 * the send fails or the recipient hasn't opted in to WhatsApp.
 */
export async function whatsappSend(
  templateId: string,
  variables: (string | number)[],
  recipientPhone: string,
  opts: { optedIn?: boolean } = {},
): Promise<SendResult> {
  if (!WHATSAPP_TEMPLATES[templateId]) {
    throw new Error(`Unknown WhatsApp template: ${templateId}`);
  }
  const optedIn = opts.optedIn ?? true;
  const body = renderWhatsAppBody(templateId, variables);

  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (optedIn && token && phoneId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipientPhone.replace(/\D/g, ""),
          type: "template",
          template: {
            name: templateId,
            language: { code: "en" },
            components: [
              { type: "body", parameters: variables.map((v) => ({ type: "text", text: String(v) })) },
            ],
          },
        }),
      });
      if (res.ok) return { ok: true, channel: "whatsapp", mock: false, templateId };
    } catch {
      /* fall through to SMS */
    }
    return { ...(await sendSms(recipientPhone, body)), templateId };
  }

  if (optedIn && !token) {
    // Dev mock — never log the rendered body (may contain PII).
    console.info(`[whatsapp:mock] template=${templateId} -> ${maskPhone(recipientPhone)}`);
    return { ok: true, channel: "whatsapp", mock: true, templateId };
  }

  // Not opted in → SMS fallback.
  return { ...(await sendSms(recipientPhone, body)), templateId };
}
