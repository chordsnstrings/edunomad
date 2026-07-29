import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/site/Section";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom, breadcrumbJsonLd } from "@/lib/seo";
import { NATIVE_LOCALES } from "@/content/seo/i18n";
import { ARTICLES, CATEGORIES } from "@/content/seo/articles";

const TITLE = "Study in Canada Guides for Bangladesh, India & Nepal (2026)";
const DESC =
  "Free, regularly updated guides on studying in Canada from Bangladesh, India and Nepal — costs, proof of funds and GIC, IELTS, the study permit after SDS ended, universities, scholarships and the PGWP-to-PR pathway.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESC,
    keywords: ["study in canada guides", "canada student visa bangladesh india nepal", "canada study permit 2026", "gic proof of funds canada", "pgwp pr canada"],
    // hreflang must be reciprocal: each variant lists every variant including
    // itself, otherwise search engines drop the cluster entirely.
    alternates: {
      canonical: "/guides",
      languages: {
        en: "/guides",
        "x-default": "/guides",
        ...Object.fromEntries(NATIVE_LOCALES.map((l) => [l, `/${l}/guides`])),
      },
    },
    openGraph: { type: "website", title: TITLE, description: DESC, url: "/guides" },
  };
}

export default async function GuidesHub() {
  const settings = await getSettings();
  const base = siteUrlFrom(settings);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: base },
            { name: "Guides", url: `${base}/guides` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: TITLE,
            description: DESC,
            url: `${base}/guides`,
            isPartOf: { "@id": `${base}/#website` },
            inLanguage: "en",
          },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-semibold leading-tight text-navy sm:text-4xl">{TITLE}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/80">{DESC}</p>
          <p className="mt-2 text-sm text-muted">{ARTICLES.length}+ guides, updated for 2026 IRCC rules.</p>

          <div className="mt-10 space-y-10">
            {CATEGORIES.map((cat) => {
              const items = ARTICLES.filter((a) => a.category === cat.key);
              return (
                <section key={cat.key}>
                  <h2 className="text-lg font-semibold text-navy">
                    {cat.label} <span className="text-sm font-normal text-muted">({items.length})</span>
                  </h2>
                  <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {items.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/guides/${a.slug}`} className="block rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-subtle hover:text-navy">
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
