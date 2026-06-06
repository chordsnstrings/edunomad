import { getSettings } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";
import { ARTICLES } from "@/content/seo/articles";

// /feed.xml — RSS of the guides. Helps search engines discover and re-crawl new
// content quickly, and gives LLM/agent crawlers a clean, structured index.
export const dynamic = "force-dynamic";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c] ?? c));
}

// Prioritise the highest-intent categories in the feed.
const PRIORITY = ["country", "visa", "funds", "tests", "lists", "answers", "scholarships", "university", "field", "careers", "province", "city", "compare", "planning", "cost", "pr"];

export async function GET() {
  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  const now = new Date().toUTCString();

  const items = [...ARTICLES]
    .sort((a, b) => PRIORITY.indexOf(a.category) - PRIORITY.indexOf(b.category))
    .slice(0, 200)
    .map((a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${base}/guides/${a.slug}</link>
      <guid isPermaLink="true">${base}/guides/${a.slug}</guid>
      <description>${esc(a.description)}</description>
      <category>${esc(a.categoryLabel)}</category>
      <pubDate>${now}</pubDate>
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(settings.companyName)} — Study in Canada Guides (Bangladesh, India, Nepal)</title>
    <link>${base}/guides</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(settings.metaDescription || settings.shortDescription)}</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" },
  });
}
