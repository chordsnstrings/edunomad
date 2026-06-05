import { prisma } from "./db";

/** Extract an embedded application reference (EN-XXXXXXXX). */
export function extractReferenceId(text: string): string | null {
  return text.match(/EN-[A-Z0-9]{8}/)?.[0] ?? null;
}

export async function ingestInboundEmail(email: { fromAddress: string; subject: string; body: string }) {
  const referenceId = extractReferenceId(`${email.subject}\n${email.body}`);
  let applicationId: string | null = null;
  if (referenceId) {
    const app = await prisma.application.findFirst({ where: { referenceId }, select: { id: true } });
    applicationId = app?.id ?? null;
  }
  return prisma.inboundEmail.create({
    data: { fromAddress: email.fromAddress, subject: email.subject, body: email.body, referenceId, applicationId },
  });
}
