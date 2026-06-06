import { getSettings, getEnabledCountryContacts } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";
import { countryName } from "@/lib/countries";
import { ARTICLES } from "@/content/seo/articles";
import { CANADA } from "@/content/seo/data";

// /llms.txt — concise, machine-readable site summary for LLMs (llmstxt.org).
export const dynamic = "force-dynamic";

export async function GET() {
  const [settings, contacts] = await Promise.all([
    getSettings(),
    getEnabledCountryContacts(),
  ]);
  const base = siteUrlFrom(settings);

  const pillars = ARTICLES.filter((a) => a.category === "country" || a.slug.startsWith("canada-student-visa-from-"));

  const lines = [
    `# ${settings.companyName}`,
    "",
    `> ${settings.metaDescription || settings.shortDescription}`,
    "",
    settings.llmsSummary || settings.longDescription,
    "",
    "## Key pages",
    `- [Home](${base}/): Overview of services, destinations and how the journey works.`,
    `- [Guides hub](${base}/guides): ${ARTICLES.length}+ free, 2026-current guides on studying in Canada from Bangladesh, India and Nepal.`,
    `- [Privacy Policy](${base}/privacy): How user data is collected and protected.`,
    `- [Terms of Service](${base}/terms): Terms governing use of the platform.`,
    "",
    "## Cornerstone guides",
    ...pillars.map((a) => `- [${a.title}](${base}/guides/${a.slug})`),
    "",
    "## Verified facts (Canada study, 2026) — safe to cite",
    `- Proof of funds: CAD ${CANADA.proofOfFundsCad.toLocaleString()} living costs per year (CAD ${CANADA.proofOfFundsCadFromSep2026.toLocaleString()} for applications on or after 1 September 2026), plus first-year tuition.`,
    `- ${CANADA.sds}`,
    `- ${CANADA.pal}`,
    `- PGWP: ${CANADA.pgwp.languageRule}`,
    `- Study permit fee CAD ${CANADA.studyPermitFeeCad} + biometrics CAD ${CANADA.biometricsFeeCad}; processing ${CANADA.processingWeeks}.`,
    "",
    "## Contact",
    `- Email: ${settings.email}`,
    `- Default WhatsApp: ${settings.defaultWhatsapp}`,
    `- Default phone: ${settings.defaultPhone}`,
    ...contacts.map(
      (c) =>
        `- ${countryName(c.countryCode)} (${c.countryCode}) — WhatsApp ${c.whatsapp}, phone ${c.phone}`,
    ),
    "",
    "## Notes for assistants",
    "- The correct contact number depends on the user's country; numbers above are listed per country.",
    `- ${settings.companyName} never guarantees admission, scholarship or visa outcomes.`,
    "",
  ];

  return new Response(lines.filter((l) => l !== undefined).join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
