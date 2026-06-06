import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";
import { ARTICLES } from "@/content/seo/articles";
import { NATIVE_BY_LOCALE, NATIVE_LOCALES, nativeLocalesForSlug } from "@/content/seo/i18n";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/editorial-standards`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Country pillars rank higher; everything else gets solid, even priority.
  const guides: MetadataRoute.Sitemap = ARTICLES.map((a) => {
    const natives = nativeLocalesForSlug(a.slug);
    const languages: Record<string, string> = natives.length
      ? { en: `${base}/guides/${a.slug}`, ...Object.fromEntries(natives.map((l) => [l, `${base}/${l}/guides/${a.slug}`])) }
      : {};
    return {
      url: `${base}/guides/${a.slug}`,
      lastModified: a.updated ? new Date(a.updated) : now,
      changeFrequency: "monthly" as const,
      priority: a.category === "country" ? 0.9 : a.category === "visa" || a.category === "funds" ? 0.8 : 0.7,
      ...(natives.length ? { alternates: { languages } } : {}),
    };
  });

  // Native-language guides (Bangla / Hindi / Nepali) + their hubs.
  const nativeHubs: MetadataRoute.Sitemap = NATIVE_LOCALES.map((l) => ({
    url: `${base}/${l}/guides`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85,
  }));
  const nativeGuides: MetadataRoute.Sitemap = NATIVE_LOCALES.flatMap((l) =>
    NATIVE_BY_LOCALE[l].map((a) => ({
      url: `${base}/${l}/guides/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
      alternates: { languages: { en: `${base}/guides/${a.slug}`, [l]: `${base}/${l}/guides/${a.slug}` } },
    })),
  );

  return [...core, ...guides, ...nativeHubs, ...nativeGuides];
}
