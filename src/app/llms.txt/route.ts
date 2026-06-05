import { getSettings, getEnabledCountryContacts } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";
import { countryName } from "@/lib/countries";

// /llms.txt — concise, machine-readable site summary for LLMs (llmstxt.org).
export const dynamic = "force-dynamic";

export async function GET() {
  const [settings, contacts] = await Promise.all([
    getSettings(),
    getEnabledCountryContacts(),
  ]);
  const base = siteUrlFrom(settings);

  const lines = [
    `# ${settings.companyName}`,
    "",
    `> ${settings.metaDescription || settings.shortDescription}`,
    "",
    settings.llmsSummary || settings.longDescription,
    "",
    "## Key pages",
    `- [Home](${base}/): Overview of services, destinations and how the journey works.`,
    `- [Privacy Policy](${base}/privacy): How user data is collected and protected.`,
    `- [Terms of Service](${base}/terms): Terms governing use of the platform.`,
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
