import { prisma } from "./db";
import { renderEventTemplate } from "./event-templates";
import type { Locale } from "../i18n/config";

/** Build a parent's daily digest of parent-visible events (G106). */
export async function buildParentDigest(studentId: string, locale: Locale, since = new Date(Date.now() - 24 * 3600 * 1000)): Promise<string | null> {
  const events = await prisma.event.findMany({
    where: { studentId, createdAt: { gte: since }, visibility: { path: ["P"], equals: true } },
    orderBy: { seq: "asc" },
  });
  if (events.length === 0) return null;
  const lines = events.map((e) => "• " + renderEventTemplate({ type: e.type, payload: e.payload as Record<string, unknown> | null }, locale));
  return `EduNomad — today's update:\n${lines.join("\n")}`;
}
