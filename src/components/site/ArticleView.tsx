import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Section } from "@/components/site/Section";
import type { Article, Block } from "@/content/seo/articles";
import { SOURCES } from "@/content/seo/data";

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case "h2":
      return <h2 className="mt-10 text-xl font-semibold text-navy sm:text-2xl">{b.text}</h2>;
    case "p":
      return <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{b.text}</p>;
    case "callout":
      return (
        <div className="mt-5 rounded-xl border-l-4 border-gold bg-subtle px-4 py-3 text-[15px] leading-relaxed text-ink/85">
          {b.text}
        </div>
      );
    case "ul":
      return (
        <ul className="mt-4 space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-ink/80">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-4 space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink/80">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">{i + 1}</span>
              <span className="pt-0.5">{it}</span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="mt-5 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-subtle">
                {b.head.map((h, i) => (
                  <th key={i} className="px-3 py-2.5 font-semibold text-navy">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-line/60 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2.5 align-top text-ink/80">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function ArticleView({ article, related }: { article: Article; related: Article[] }) {
  return (
    <Section>
      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="hover:text-navy">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/guides" className="hover:text-navy">Guides</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink/70">{article.categoryLabel}</span>
        </nav>

        <h1 className="mt-4 text-2xl font-semibold leading-tight text-navy sm:text-4xl">{article.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-ink/80">{article.intro}</p>
        <p className="mt-3 text-xs text-muted">
          Updated {article.updated} · EduNomad editorial team
        </p>

        <div className="mt-2">
          {article.blocks.map((b, i) => (
            <BlockView key={i} b={b} />
          ))}
        </div>

        {article.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-navy sm:text-2xl">Frequently asked questions</h2>
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
          <h2 className="text-lg font-semibold">Build your plan with EduNomad</h2>
          <p className="mt-2 text-sm text-white/80">
            Create a free profile and see the programmes you genuinely qualify for, with real cost
            estimates and a counsellor who owns your file. We never promise an outcome — we make the
            path clear and honest.
          </p>
          <Link href="/signup" className="mt-4 inline-flex rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy hover:opacity-90">
            Start free
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-navy">Related guides</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/guides/${r.slug}`} className="block rounded-xl border border-line px-4 py-3 text-sm text-navy hover:bg-subtle">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 border-t border-line pt-5">
          <h2 className="text-sm font-semibold text-navy">Sources & further reading</h2>
          <ul className="mt-2 space-y-1 text-xs text-muted">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer nofollow" className="underline hover:text-navy">{s.label}</a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            Figures are approximate and change with IRCC policy and institution updates — verify on
            the official source before you apply. EduNomad does not guarantee admission, scholarship
            or visa outcomes. See our{" "}
            <Link href="/editorial-standards" className="underline hover:text-navy">editorial standards</Link>.
          </p>
        </section>
      </article>
    </Section>
  );
}
