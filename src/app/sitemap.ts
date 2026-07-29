import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";
import { ARTICLES } from "@/content/seo/articles";
import { NATIVE_BY_LOCALE, NATIVE_LOCALES, nativeLocalesForSlug } from "@/content/seo/i18n";
import { shouldIndex, sitemapPriority } from "@/content/seo/quality";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  const now = new Date();
  const indexedSlugs = new Set(ARTICLES.filter(shouldIndex).map((a) => a.slug));

  const core: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/editorial-standards`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Priority comes from measured depth, not from the category a page belongs to.
  // Stubs are left out entirely rather than submitted alongside the pillars —
  // they stay reachable and still pass link equity, they are just not offered as
  // ranking candidates until they have the substance to be one.
  const guides: MetadataRoute.Sitemap = ARTICLES.filter(shouldIndex).map((a) => {
    const natives = nativeLocalesForSlug(a.slug);
    const languages: Record<string, string> = natives.length
      ? { en: `${base}/guides/${a.slug}`, ...Object.fromEntries(natives.map((l) => [l, `${base}/${l}/guides/${a.slug}`])) }
      : {};
    return {
      url: `${base}/guides/${a.slug}`,
      lastModified: a.updated ? new Date(a.updated) : now,
      changeFrequency: "monthly" as const,
      priority: sitemapPriority(a),
      ...(natives.length ? { alternates: { languages } } : {}),
    };
  });

  // Native-language guides (Bangla / Hindi / Nepali) + their hubs.
  const nativeHubs: MetadataRoute.Sitemap = NATIVE_LOCALES.map((l) => ({
    url: `${base}/${l}/guides`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85,
  }));
  const nativeGuides: MetadataRoute.Sitemap = NATIVE_LOCALES.flatMap((l) =>
    NATIVE_BY_LOCALE[l].filter((a) => indexedSlugs.has(a.slug)).map((a) => ({
      url: `${base}/${l}/guides/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
      alternates: { languages: { en: `${base}/guides/${a.slug}`, [l]: `${base}/${l}/guides/${a.slug}` } },
    })),
  );

  return [...core, ...guides, ...nativeHubs, ...nativeGuides];
}
