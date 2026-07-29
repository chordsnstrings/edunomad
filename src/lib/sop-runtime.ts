import { prisma } from "./db";
import type { SopBlock } from "./sop-cms";
import { evaluateCondition, type ConditionContext } from "./sop-conditions";

export async function getPublishedSops() {
  // Only the published projection: the draft `blocks` column can be large and is
  // never read here, and the list is bounded.
  return prisma.sopArticle.findMany({
    where: { status: "published", publishedVersion: { not: null } },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      publishedVersion: true,
      publishedBlocks: true,
    },
    take: 200,
  });
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

/**
 * Contextual surfacing engine (G149): published trigger_rule blocks matching a
 * screen *and* whose condition holds for the record on it.
 *
 * The condition used to be ignored, so every rule authored for a screen showed
 * on that screen for every record. A right rail that is always full is a right
 * rail nobody reads. An unparseable condition surfaces nothing rather than
 * everything — a broken rule should be invisible, not louder.
 */
export async function surfaceSopBlocks(
  when: string,
  ctx: ConditionContext = {},
): Promise<{ article: string; slug: string; block: SopBlock }[]> {
  const all = await getPublishedSops();
  const out: { article: string; slug: string; block: SopBlock }[] = [];
  for (const a of all) {
    for (const b of (a.publishedBlocks as SopBlock[] | null) ?? []) {
      if (b.type !== "trigger_rule" || b.when !== when) continue;
      if (evaluateCondition(b.condition as string | undefined, ctx) !== true) continue;
      out.push({ article: a.title, slug: a.slug, block: b });
    }
  }
  return out;
}

/**
 * Every compliance_warning keyword a manager has published, as guards.
 *
 * The composer only ever checked the hard-coded guard list, so a keyword added
 * through the SOP CMS — the whole point of §8 "managers, not engineers, author
 * this" — produced no runtime effect at all.
 */
export async function sopComplianceGuards(): Promise<
  { id: string; keywords: string[]; modalText: string }[]
> {
  const all = await getPublishedSops();
  const out: { id: string; keywords: string[]; modalText: string }[] = [];
  for (const a of all) {
    for (const [i, b] of ((a.publishedBlocks as SopBlock[] | null) ?? []).entries()) {
      if (b.type !== "compliance_warning") continue;
      const keywords = (Array.isArray(b.keywords) ? b.keywords : []).filter(
        (k): k is string => typeof k === "string" && k.trim().length > 0,
      );
      if (keywords.length === 0) continue;
      out.push({
        id: `sop:${a.slug}:${i}`,
        keywords,
        modalText: String(b.message ?? "This wording needs a compliance check before sending."),
      });
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
