import { prisma } from "./db";
import type { SopBlock } from "./sop-cms";

export async function getPublishedSops() {
  return prisma.sopArticle.findMany({ where: { status: "published", publishedVersion: { not: null } } });
}

export async function getPublishedSopBySlug(slug: string) {
  const a = await prisma.sopArticle.findUnique({ where: { slug } });
  return a && a.publishedVersion ? a : null;
}

/** Cross-app SOP search over published content (G150). */
export async function searchSops(q: string) {
  const all = await getPublishedSops();
  const ql = q.trim().toLowerCase();
  if (!ql) return all;
  return all.filter((a) => a.title.toLowerCase().includes(ql) || JSON.stringify(a.publishedBlocks ?? []).toLowerCase().includes(ql));
}

/** Contextual surfacing engine (G149): published trigger_rule blocks matching a screen. */
export async function surfaceSopBlocks(when: string): Promise<{ article: string; slug: string; block: SopBlock }[]> {
  const all = await getPublishedSops();
  const out: { article: string; slug: string; block: SopBlock }[] = [];
  for (const a of all) {
    for (const b of (a.publishedBlocks as SopBlock[] | null) ?? []) {
      if (b.type === "trigger_rule" && b.when === when) out.push({ article: a.title, slug: a.slug, block: b });
    }
  }
  return out;
}

/** Live KPI resolver for kpi blocks (G152). */
export async function resolveKpi(metric: string): Promise<number> {
  switch (metric) {
    case "students_assigned": return prisma.student.count({ where: { assignedCounsellorId: { not: null } } });
    case "shortlists_locked": return prisma.application.count({ where: { shortlistStatus: "locked" } });
    case "applications_submitted": return prisma.application.count({ where: { submissionStatus: "submitted" } });
    case "visa_signed_off": return prisma.visaFile.count({ where: { signedOffAt: { not: null } } });
    default: return 0;
  }
}

export async function recordSopView(articleId: string, version: number, userId: string) {
  await prisma.sopView.create({ data: { articleId, version, userId } });
}

/** Checklist quality gate (G151): true only when every item is checked. */
export function isGateSatisfied(items: string[], checked: Record<number, boolean>): boolean {
  return items.every((_, i) => checked[i]);
}
