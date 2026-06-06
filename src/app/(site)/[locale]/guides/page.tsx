import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/site/Section";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom, breadcrumbJsonLd } from "@/lib/seo";
import { NATIVE_LOCALES, NATIVE_BY_LOCALE, LOCALE_LABEL, LOCALE_NAME, type NativeLocale } from "@/content/seo/i18n";

const TITLE: Record<NativeLocale, string> = {
  bn: "কানাডায় পড়াশোনার গাইড — বাংলাদেশের শিক্ষার্থীদের জন্য (২০২৬)",
  hi: "कनाडा में पढ़ाई की गाइड — भारतीय छात्रों के लिए (2026)",
  ne: "क्यानाडा अध्ययन गाइड — नेपाली विद्यार्थीका लागि (२०२६)",
};
const DESC: Record<NativeLocale, string> = {
  bn: "খরচ, proof of funds ও GIC, IELTS, study permit, scholarship এবং PR — বাংলায় বিনামূল্যে গাইড।",
  hi: "खर्च, proof of funds और GIC, IELTS, study permit, scholarship और PR — हिन्दी में मुफ़्त गाइड।",
  ne: "खर्च, proof of funds र GIC, IELTS, NOC, study permit, scholarship र PR — नेपालीमा निःशुल्क गाइड।",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!NATIVE_LOCALES.includes(locale as NativeLocale)) return { title: "Not found", robots: { index: false } };
  const l = locale as NativeLocale;
  return {
    title: TITLE[l],
    description: DESC[l],
    alternates: { canonical: `/${l}/guides`, languages: { en: "/guides", "x-default": "/guides", [l]: `/${l}/guides` } },
    openGraph: { type: "website", title: TITLE[l], description: DESC[l], url: `/${l}/guides`, locale: l },
  };
}

export default async function NativeHub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!NATIVE_LOCALES.includes(locale as NativeLocale)) notFound();
  const l = locale as NativeLocale;
  const items = NATIVE_BY_LOCALE[l];
  const settings = await getSettings();
  const base = siteUrlFrom(settings);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "EduNomad", url: base }, { name: TITLE[l], url: `${base}/${l}/guides` }])} />
      <Section>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-semibold leading-tight text-navy sm:text-4xl">{TITLE[l]}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/80">{DESC[l]}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href="/guides" className="rounded-lg border border-line px-3 py-1.5 text-navy hover:bg-subtle">English ({"600+"})</Link>
            {NATIVE_LOCALES.filter((x) => x !== l).map((x) => (
              <Link key={x} href={`/${x}/guides`} className="rounded-lg border border-line px-3 py-1.5 text-navy hover:bg-subtle">{LOCALE_LABEL[x]}</Link>
            ))}
          </div>

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {items.map((a) => (
              <li key={a.slug}>
                <Link href={`/${l}/guides/${a.slug}`} className="block h-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm font-medium text-navy hover:border-gold/50">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            {LOCALE_NAME[l]} · {items.length} guides ·{" "}
            <Link href="/guides" className="underline hover:text-navy">English: 600+ guides</Link>
          </p>
        </div>
      </Section>
    </>
  );
}
