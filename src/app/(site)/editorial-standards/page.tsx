import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/site/Section";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom, breadcrumbJsonLd } from "@/lib/seo";
import { ARTICLES } from "@/content/seo/articles";
import { SOURCES, LAST_UPDATED } from "@/content/seo/data";

const TITLE = "Editorial Standards & How We Research Our Guides";
const DESC =
  "How EduNomad researches, writes, reviews and updates its study-in-Canada guides — our sources (IRCC and official bodies), our no-guarantees honesty policy, and how to report a correction.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESC,
    alternates: { canonical: "/editorial-standards" },
    openGraph: { type: "article", title: TITLE, description: DESC, url: "/editorial-standards" },
  };
}

export default async function EditorialStandards() {
  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: base }, { name: "Editorial standards", url: `${base}/editorial-standards` }])} />
      <Section>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl">{TITLE}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
            {settings.companyName} publishes {ARTICLES.length}+ free guides for students from
            Bangladesh, India and Nepal applying to Canada. Because these decisions involve money,
            visas and people&apos;s futures, we hold our content to a high standard. Here is how it
            is made.
          </p>

          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/80">
            <div>
              <h2 className="text-xl font-semibold text-navy">Who writes and reviews it</h2>
              <p className="mt-2">
                Guides are written by the {settings.companyName} editorial team and informed by our
                counsellors and operations staff who package real applications every week. Anything
                touching a visa decision reflects current IRCC rules; visa files on our platform are
                signed off by a licensed compliance professional (RCIC for Canada, MARA for
                Australia) — guidance here is educational and not a substitute for that regulated
                advice.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-navy">Our sources</h2>
              <p className="mt-2">We ground figures and rules in official primary sources, including:</p>
              <ul className="mt-2 space-y-1">
                {SOURCES.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer nofollow" className="text-navy underline">{s.label}</a>
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                Costs and fees are presented as honest ranges — we tell you to verify the exact
                number on the institution&apos;s or government&apos;s official page before you act.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-navy">Accuracy and updates</h2>
              <p className="mt-2">
                Canadian study rules change often (SDS ended, proof of funds rose, the PGWP added a
                language test). When a rule changes, we update our central data so every affected
                guide changes at once. Our guides were last reviewed on {LAST_UPDATED}.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-navy">Our honesty policy</h2>
              <p className="mt-2">
                We never promise an admission, scholarship or visa outcome — those decisions belong
                to universities and government authorities, and anyone guaranteeing them is not being
                straight with you. We&apos;d rather tell you an uncomfortable truth (a refusal risk, a
                real cost) than win your trust with a comfortable lie.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-navy">Found a mistake?</h2>
              <p className="mt-2">
                Rules and fees move. If something here is out of date, email{" "}
                <a href={`mailto:${settings.email}`} className="text-navy underline">{settings.email}</a>{" "}
                and we&apos;ll fix it. Start with our{" "}
                <Link href="/guides" className="text-navy underline">guides hub</Link>.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
