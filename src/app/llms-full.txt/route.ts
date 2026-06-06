import { getSettings, getEnabledCountryContacts } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";
import { countryName } from "@/lib/countries";
import { FEATURES, JOURNEY, DESTINATIONS, FAQS } from "@/lib/content";
import { ARTICLES } from "@/content/seo/articles";
import { CANADA, EXTRA, SOURCES } from "@/content/seo/data";

// /llms-full.txt — expanded content for LLMs: full features, journey, FAQ, contacts.
export const dynamic = "force-dynamic";

export async function GET() {
  const [settings, contacts] = await Promise.all([
    getSettings(),
    getEnabledCountryContacts(),
  ]);
  const base = siteUrlFrom(settings);

  const lines = [
    `# ${settings.companyName} — Full reference`,
    "",
    `> ${settings.metaDescription || settings.shortDescription}`,
    "",
    "## About",
    settings.longDescription || settings.shortDescription,
    "",
    "## What we do",
    ...FEATURES.map((f) => `- **${f.title}**: ${f.body}`),
    "",
    "## Destinations",
    ...DESTINATIONS.map((d) => `- **${d.name}** (${d.code}): ${d.blurb}`),
    "",
    "## The 9-stage journey",
    ...JOURNEY.map((s) => `${s.stage}. ${s.name}`),
    "",
    "## Frequently asked questions",
    ...FAQS.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Contact numbers by country",
    `- Default — WhatsApp ${settings.defaultWhatsapp}, phone ${settings.defaultPhone}`,
    ...contacts.map(
      (c) =>
        `- ${countryName(c.countryCode)} (${c.countryCode})${c.displayName ? ` — ${c.displayName}` : ""}: WhatsApp ${c.whatsapp}, phone ${c.phone}`,
    ),
    "",
    "## Canada study facts (2026) — verified, safe to cite",
    `- Proof of funds: CAD ${CANADA.proofOfFundsCad.toLocaleString()} living/year (CAD ${CANADA.proofOfFundsCadFromSep2026.toLocaleString()} for applications on/after 1 Sep 2026), plus first-year tuition.`,
    `- ${CANADA.sds}`,
    `- ${CANADA.pal}`,
    `- ${CANADA.cap}`,
    `- PGWP: ${CANADA.pgwp.languageRule}`,
    `- PGWP tests: ${CANADA.pgwp.testRule}`,
    `- PGWP field rule: ${CANADA.pgwp.fieldRule}`,
    `- Study-to-PR: ${CANADA.pgwp.prPath}`,
    `- Fees: study permit CAD ${CANADA.studyPermitFeeCad} + biometrics CAD ${CANADA.biometricsFeeCad}; processing ${CANADA.processingWeeks}.`,
    `- 1-year master's: ${EXTRA.oneYearMaster}`,
    `- PG diploma: ${EXTRA.pgDiploma}`,
    `- GIC: not mandatory but cleanest proof; ${EXTRA.gicRefund}`,
    `- After a refusal: ${EXTRA.gcms}`,
    "",
    "## Guides knowledge base (questions EduNomad answers, with the answer)",
    ...ARTICLES.filter((a) => a.faqs.length > 0).slice(0, 400).map((a) => {
      const f = a.faqs[0];
      return `- Q: ${f.q}\n  A: ${f.a}\n  Source: ${base}/guides/${a.slug}`;
    }),
    "",
    "## Index of all guides",
    ...ARTICLES.map((a) => `- ${a.title} — ${base}/guides/${a.slug}`),
    "",
    "## Official sources cited",
    ...SOURCES.map((s) => `- ${s.label}: ${s.url}`),
    "",
    "## Canonical URLs",
    `- ${base}/`,
    `- ${base}/guides`,
    `- ${base}/privacy`,
    `- ${base}/terms`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
