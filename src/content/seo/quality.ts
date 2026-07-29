import type { Article } from "./articles";

/**
 * Substance measurement for the programmatic guide corpus.
 *
 * Every one of the 663 generated guides was submitted in the sitemap at priority
 * 0.7 or higher, chosen by category alone. That tells a search engine that 138
 * pages sharing one block shape are all equally among the most important things
 * on the domain — the shape of a doorway cluster, and the resulting site-wide
 * quality signal lands on the pages that *are* substantial too. Ten of them are
 * genuine stubs under 120 words and were advertised at the same weight as a
 * 700-word country pillar.
 *
 * The stubs are still useful — a real cost table for Toronto is worth showing to
 * someone who lands on it — so nothing is deleted. They are simply no longer
 * advertised as ranking candidates until they earn it: below the floor a page is
 * `noindex, follow` and absent from the sitemap, so it stays reachable and still
 * passes link equity onward. Above it, priority comes from measured depth rather
 * than from the category a page happens to belong to.
 */

/** Below this a page is a stub, not an answer. */
export const INDEX_FLOOR_WORDS = 120;
/** Above this a page stands on its own as a destination. */
export const DEEP_WORDS = 400;

export function articleWordCount(a: Article): number {
  const parts: string[] = [a.title ?? "", a.description ?? "", a.intro ?? ""];
  for (const b of a.blocks ?? []) {
    const block = b as { text?: string; items?: string[]; rows?: string[][] };
    if (block.text) parts.push(block.text);
    if (block.items) parts.push(block.items.join(" "));
    if (block.rows) parts.push(block.rows.flat().join(" "));
  }
  for (const f of a.faqs ?? []) parts.push(f.q, f.a);
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export type Depth = "stub" | "standard" | "deep";

export function articleDepth(a: Article): Depth {
  const w = articleWordCount(a);
  if (w < INDEX_FLOOR_WORDS) return "stub";
  return w >= DEEP_WORDS ? "deep" : "standard";
}

/** Whether to ask a search engine to index this page at all. */
export function shouldIndex(a: Article): boolean {
  return articleDepth(a) !== "stub";
}

/**
 * Sitemap priority derived from depth, then nudged by category. A stub is never
 * submitted, so this is only called for pages that clear the floor.
 */
export function sitemapPriority(a: Article): number {
  const base = articleDepth(a) === "deep" ? 0.8 : 0.6;
  const bump =
    a.category === "country" ? 0.1 : a.category === "visa" || a.category === "funds" ? 0.05 : 0;
  return Math.min(0.9, Math.round((base + bump) * 100) / 100);
}
