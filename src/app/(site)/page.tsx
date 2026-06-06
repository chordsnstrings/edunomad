import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Features } from "@/components/site/Features";
import { Journey } from "@/components/site/Journey";
import { Destinations } from "@/components/site/Destinations";
import { FAQ } from "@/components/site/FAQ";
import { ContactSection } from "@/components/site/ContactSection";
import { CTA } from "@/components/site/CTA";
import { Section } from "@/components/site/Section";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSiteContext } from "@/lib/context";
import { faqJsonLd } from "@/lib/seo";
import { FAQS } from "@/lib/content";
import { ARTICLES } from "@/content/seo/articles";

const HOME_TITLE = "Study in Canada from Bangladesh, India & Nepal (2026) — EduNomad";
const HOME_DESC =
  "EduNomad guides students from Bangladesh, India and Nepal to Canada — eligibility matching, costs and GIC, IELTS, the study permit after SDS ended, a dedicated counsellor, regulated visa sign-off, and 600+ free 2026 guides.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: HOME_TITLE,
    description: HOME_DESC,
    keywords: ["study in canada from bangladesh", "study in canada from india", "study in canada from nepal", "canada student visa 2026", "canada study permit", "gic proof of funds canada", "pgwp pr canada"],
    alternates: { canonical: "/" },
  };
}

const POPULAR = [
  "study-in-canada-from-bangladesh", "study-in-canada-from-india", "study-in-canada-from-nepal",
  "canada-student-visa-from-india", "proof-of-funds-canada-study-visa-india", "gic-canada-for-india-students",
  "cost-of-studying-in-canada-from-bangladesh", "scholarships-in-canada-for-nepal-students",
  "pgwp-and-pr-after-studying-in-canada-india", "study-in-canada-without-ielts-from-bangladesh",
  "is-sds-discontinued", "cheapest-universities-in-canada-for-international-students",
];

function PopularGuides() {
  const items = POPULAR.map((s) => ARTICLES.find((a) => a.slug === s)).filter((a): a is NonNullable<typeof a> => Boolean(a));
  return (
    <Section className="bg-subtle">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-navy sm:text-3xl">Popular study-in-Canada guides</h2>
          <p className="mt-2 max-w-xl text-[15px] text-ink/70">
            Free, honest, 2026-current guides for Bangladeshi, Indian and Nepali students — costs,
            funds, visa, universities and PR.
          </p>
        </div>
        <Link href="/guides" className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-600 sm:inline-flex">
          All {ARTICLES.length}+ guides <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <li key={a.slug}>
            <Link href={`/guides/${a.slug}`} className="block h-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm font-medium text-navy hover:border-gold/50 hover:bg-white">
              {a.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/guides" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-600 sm:hidden">
        All {ARTICLES.length}+ guides <ArrowRight className="h-4 w-4" />
      </Link>
    </Section>
  );
}

export default async function HomePage() {
  const { settings, contact } = await getSiteContext();

  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <Hero settings={settings} contact={contact} />
      <Stats />
      <Features />
      <PopularGuides />
      <Journey />
      <Destinations />
      <FAQ />
      <ContactSection settings={settings} contact={contact} />
      <CTA />
    </>
  );
}
