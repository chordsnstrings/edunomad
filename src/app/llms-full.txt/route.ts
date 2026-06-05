import { getSettings, getEnabledCountryContacts } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";
import { countryName } from "@/lib/countries";
import { FEATURES, JOURNEY, DESTINATIONS, FAQS } from "@/lib/content";

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
    "## Canonical URLs",
    `- ${base}/`,
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
