import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NativeArticleView } from "@/components/site/NativeArticleView";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom, articleJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { nativeArticle, NATIVE_LOCALES, NATIVE_BY_LOCALE, nativeLocalesForSlug, type NativeLocale } from "@/content/seo/i18n";

function hreflang(slug: string, base: string) {
  const langs: Record<string, string> = { en: `${base}/guides/${slug}`, "x-default": `${base}/guides/${slug}` };
  for (const l of nativeLocalesForSlug(slug)) langs[l] = `${base}/${l}/guides/${slug}`;
  return langs;
}

/** Prerender every native-language guide at build time. */
export function generateStaticParams() {
  return NATIVE_LOCALES.flatMap((locale) =>
    NATIVE_BY_LOCALE[locale].map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = nativeArticle(locale, slug);
  if (!a) return { title: "Not found", robots: { index: false } };
  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  const url = `/${locale}/guides/${slug}`;
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: url, languages: hreflang(slug, base) },
    openGraph: { type: "article", title: a.title, description: a.description, url, locale },
  };
}

export default async function NativeGuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!NATIVE_LOCALES.includes(locale as NativeLocale)) notFound();
  const a = nativeArticle(locale, slug);
  if (!a) notFound();

  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  const url = `${base}/${locale}/guides/${slug}`;

  return (
    <div lang={locale}>
    <>
      <JsonLd
        data={[
          articleJsonLd({ base, url, title: a.title, description: a.description, dateModified: "2026-06-06", companyName: settings.companyName }),
          faqJsonLd(a.faqs.map((f) => ({ q: f.q, a: f.a }))),
          breadcrumbJsonLd([{ name: "EduNomad", url: base }, { name: "Guides", url: `${base}/${locale}/guides` }, { name: a.title, url }]),
        ]}
      />
      <NativeArticleView article={a} />
    </>

    </div>
  );
}
