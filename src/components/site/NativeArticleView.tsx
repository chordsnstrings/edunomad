import Link from "next/link";
import { ChevronRight, Globe } from "lucide-react";
import { Section } from "@/components/site/Section";
import type { Block } from "@/content/seo/articles";
import type { NativeArticle, NativeLocale } from "@/content/seo/i18n";
import { LOCALE_LABEL } from "@/content/seo/i18n";
import { SOURCES } from "@/content/seo/data";

const UI: Record<NativeLocale, { guides: string; faq: string; english: string; cta: string; ctaBody: string; start: string; sources: string; disclaimer: string }> = {
  bn: {
    guides: "গাইড", faq: "সাধারণ প্রশ্নোত্তর", english: "English-এ পড়ুন",
    cta: "EduNomad-এর সাথে আপনার পরিকল্পনা সাজান",
    ctaBody: "ফ্রি profile খুলুন, বাস্তব খরচসহ আপনি যেসব programme-এ যোগ্য তা দেখুন — আমরা কখনো ফল নিশ্চয়তা দিই না, শুধু পথটা পরিষ্কার করি।",
    start: "ফ্রি শুরু করুন", sources: "তথ্যসূত্র",
    disclaimer: "সংখ্যাগুলো আনুমানিক এবং IRCC নীতির সাথে বদলায় — আবেদনের আগে official source-এ যাচাই করুন। EduNomad admission, scholarship বা visa-র ফল নিশ্চয়তা দেয় না।",
  },
  hi: {
    guides: "गाइड", faq: "अक्सर पूछे जाने वाले सवाल", english: "English में पढ़ें",
    cta: "EduNomad के साथ अपनी योजना बनाएँ",
    ctaBody: "फ्री profile बनाएँ और असली खर्च के साथ वे programmes देखें जिनके लिए आप सच में योग्य हैं — हम कभी नतीजे की गारंटी नहीं देते, बस रास्ता साफ़ करते हैं।",
    start: "फ्री शुरू करें", sources: "स्रोत",
    disclaimer: "आँकड़े अनुमानित हैं और IRCC नीति के साथ बदलते हैं — apply करने से पहले official source पर जाँचें। EduNomad admission, scholarship या visa के नतीजे की गारंटी नहीं देता।",
  },
  ne: {
    guides: "गाइड", faq: "प्रायः सोधिने प्रश्न", english: "English मा पढ्नुहोस्",
    cta: "EduNomad सँग आफ्नो योजना बनाउनुहोस्",
    ctaBody: "नि:शुल्क profile बनाउनुहोस् र वास्तविक खर्चसहित तपाईं योग्य हुने programme हेर्नुहोस् — हामी कहिल्यै नतिजाको ग्यारेन्टी दिँदैनौं, बाटो मात्र प्रस्ट बनाउँछौं।",
    start: "नि:शुल्क सुरु गर्नुहोस्", sources: "स्रोत",
    disclaimer: "अंकहरू अनुमानित हुन् र IRCC नीतिसँगै परिवर्तन हुन्छन् — apply गर्नुअघि official source मा जाँच गर्नुहोस्। EduNomad ले admission, scholarship वा visa को नतिजाको ग्यारेन्टी दिँदैन।",
  },
};

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case "h2": return <h2 className="mt-9 text-xl font-semibold text-navy sm:text-2xl">{b.text}</h2>;
    case "p": return <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{b.text}</p>;
    case "callout": return <div className="mt-5 rounded-xl border-l-4 border-gold bg-subtle px-4 py-3 text-[15px] leading-relaxed text-ink/85">{b.text}</div>;
    case "ul": return <ul className="mt-4 space-y-2">{b.items.map((it, i) => <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-ink/80"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /><span>{it}</span></li>)}</ul>;
    case "ol": return <ol className="mt-4 space-y-2">{b.items.map((it, i) => <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink/80"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">{i + 1}</span><span className="pt-0.5">{it}</span></li>)}</ol>;
    case "table": return (
      <div className="mt-5 overflow-x-auto rounded-xl border border-line"><table className="w-full text-left text-sm">
        <thead><tr className="border-b border-line bg-subtle">{b.head.map((h, i) => <th key={i} className="px-3 py-2.5 font-semibold text-navy">{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((row, ri) => <tr key={ri} className="border-b border-line/60 last:border-0">{row.map((cell, ci) => <td key={ci} className="px-3 py-2.5 align-top text-ink/80">{cell}</td>)}</tr>)}</tbody>
      </table></div>
    );
  }
}

export function NativeArticleView({ article }: { article: NativeArticle }) {
  const t = UI[article.locale];
  return (
    <Section>
      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="hover:text-navy">EduNomad</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/${article.locale}/guides`} className="hover:text-navy">{t.guides}</Link>
        </nav>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3 py-1 text-xs font-semibold text-navy">
            <Globe className="h-3.5 w-3.5" /> {LOCALE_LABEL[article.locale]}
          </span>
          <Link href={`/guides/${article.slug}`} className="text-xs font-semibold text-navy underline hover:text-gold-600">{t.english}</Link>
        </div>

        <h1 className="mt-3 text-2xl font-semibold leading-tight text-navy sm:text-4xl">{article.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-ink/80">{article.intro}</p>

        <div className="mt-2">{article.blocks.map((b, i) => <BlockView key={i} b={b} />)}</div>

        {article.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-navy sm:text-2xl">{t.faq}</h2>
            <dl className="mt-4 divide-y divide-line rounded-2xl border border-line">
              {article.faqs.map((f, i) => (
                <div key={i} className="px-4 py-4">
                  <dt className="text-[15px] font-semibold text-navy">{f.q}</dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="mt-10 rounded-2xl bg-navy px-5 py-6 text-white">
          <h2 className="text-lg font-semibold">{t.cta}</h2>
          <p className="mt-2 text-sm text-white/80">{t.ctaBody}</p>
          <Link href="/signup" className="mt-4 inline-flex rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy hover:opacity-90 tap">{t.start}</Link>
        </section>

        <section className="mt-10 border-t border-line pt-5">
          <h2 className="text-sm font-semibold text-navy">{t.sources}</h2>
          <ul className="mt-2 space-y-1 text-xs text-muted">
            {SOURCES.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer nofollow" className="underline hover:text-navy">{s.label}</a></li>)}
          </ul>
          <p className="mt-3 text-xs text-muted">{t.disclaimer}</p>
        </section>
      </article>
    </Section>
  );
}
