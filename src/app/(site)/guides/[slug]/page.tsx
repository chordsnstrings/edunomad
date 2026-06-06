import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/site/ArticleView";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom, articleJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { ARTICLE_BY_SLUG, relatedArticles } from "@/content/seo/articles";
import { nativeLocalesForSlug, LOCALE_LABEL } from "@/content/seo/i18n";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLE_BY_SLUG.get(slug);
  if (!a) return { title: "Guide not found", robots: { index: false } };
  const url = `/guides/${a.slug}`;
  const natives = nativeLocalesForSlug(a.slug);
  const languages: Record<string, string> = { en: url, "x-default": url };
  for (const l of natives) languages[l] = `/${l}/guides/${a.slug}`;
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: url, ...(natives.length ? { languages } : {}) },
    openGraph: { type: "article", title: a.title, description: a.description, url },
    twitter: { card: "summary_large_image", title: a.title, description: a.description },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLE_BY_SLUG.get(slug);
  if (!a) notFound();

  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  const url = `${base}/guides/${a.slug}`;
  const related = relatedArticles(a, 4);
  const natives = nativeLocalesForSlug(a.slug).map((l) => ({ locale: l, label: LOCALE_LABEL[l], href: `/${l}/guides/${a.slug}` }));

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({ base, url, title: a.title, description: a.description, dateModified: a.updated, companyName: settings.companyName }),
          faqJsonLd(a.faqs.map((f) => ({ q: f.q, a: f.a }))),
          breadcrumbJsonLd([
            { name: "Home", url: base },
            { name: "Guides", url: `${base}/guides` },
            { name: a.title, url },
          ]),
        ]}
      />
      <ArticleView article={a} related={related} natives={natives} />
    </>
  );
}
