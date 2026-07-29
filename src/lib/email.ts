// Email sender. Mocked in dev; swap in a provider (Resend/SES) when configured.
// PII is masked in logs (CLAUDE.md §11).

export type EmailResult = { ok: boolean; mock: boolean };

function maskEmail(to: string) {
  return to.replace(/^(.).*(@.*)$/, "$1•••$2");
}

export async function sendEmail(to: string, subject: string, _body: string): Promise<EmailResult> {
  const key = process.env.EMAIL_API_KEY;
  if (key && process.env.EMAIL_FROM) {
    // No provider integration is wired yet. Reporting ok:true here meant a
    // configured-but-unimplemented deployment silently swallowed every email
    // while telling callers it had sent them.
    console.error("[email] EMAIL_API_KEY is set but no provider integration is implemented");
    return { ok: false, mock: false };
  }
  console.info(`[email:mock] -> ${maskEmail(to)} · "${subject}"`);
  return { ok: true, mock: true };
}
