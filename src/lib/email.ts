// Email sender. Mocked in dev; swap in a provider (Resend/SES) when configured.
// PII is masked in logs (CLAUDE.md §11).

export type EmailResult = { ok: boolean; mock: boolean };

function maskEmail(to: string) {
  return to.replace(/^(.).*(@.*)$/, "$1•••$2");
}

export async function sendEmail(to: string, subject: string, _body: string): Promise<EmailResult> {
  const key = process.env.EMAIL_API_KEY;
  if (key && process.env.EMAIL_FROM) {
    // Real provider integration plugs in here.
    return { ok: true, mock: false };
  }
  console.info(`[email:mock] -> ${maskEmail(to)} · "${subject}"`);
  return { ok: true, mock: true };
}
