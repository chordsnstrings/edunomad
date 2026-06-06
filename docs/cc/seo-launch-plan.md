# SEO & LLM-SEO launch plan — Study in Canada (Bangladesh / India / Nepal)

This documents what was built, and — honestly — what it takes to turn 610 strong
pages into organic traffic. Read the "honest expectations" section before
promising anyone a number.

## What's shipped (the foundation)

- **610 data-grounded guides** at `/guides/[slug]`, generated from researched 2026
  IRCC facts and 47 real Canadian DLIs, with country-specific finance/NOC/refusal
  detail for Bangladesh, India and Nepal. Not spun filler: real numbers, tables,
  unique FAQs, source citations, honest hedging.
- **On-page SEO:** unique `<title>`, meta description, keywords and canonical per
  page; keyword-targeted H1s; internal linking (related guides + hub + homepage
  popular block); breadcrumb trail.
- **Structured data:** `Article`, `FAQPage`, `BreadcrumbList` on every guide;
  `Organization` + `WebSite` + `Service` site-wide; `CollectionPage` on the hub.
  FAQ + breadcrumb rich results are the fastest SERP wins for new sites.
- **Crawl/indexing:** `sitemap.xml` (all 610 + core), `robots.txt` (AI crawlers
  welcomed; `/admin` + `/api` blocked), `feed.xml` (RSS), and an enriched
  `llms.txt` that lists cornerstone guides + citable verified facts for LLMs.
- **Site copy:** homepage retargeted to "Study in Canada from Bangladesh, India &
  Nepal", popular-guides section, Guides nav entry.

## Honest expectations (read this)

A brand-new domain does **not** rank on page one in days. Google applies a de
facto "new site" delay; head terms like *study in canada from india* are owned by
high-authority sites (IDP, Leverage Edu, Yocket) with thousands of backlinks. **No
honest SEO can guarantee 300 organic visits/day within 15 days of launch on a new
domain from Google alone.** Anyone who promises that is guessing.

What *is* realistically achievable in ~15 days, and what the build is optimised
for:
- **Indexing fast** via Bing/IndexNow and Google Search Console (Bing indexes new
  sites in days; it powers ChatGPT search).
- **LLM/AI referrals** — `llms.txt`, clean structured data and citable, dated
  facts make these pages easy for ChatGPT, Perplexity and Gemini to surface and
  cite. This channel can produce traffic *before* Google ranks you.
- **Long-tail wins** — specific Q&A pages (e.g. *is SDS still available for Nepali
  students 2026*, *how much bank balance for canada student visa from bangladesh*)
  face far less competition than head terms and can rank within weeks.
- **Referral/direct** — seeding the guides in the right communities drives
  immediate humans and the engagement signals that help ranking.

Realistic trajectory: meaningful, compounding organic + AI traffic over **6–12
weeks** with the actions below; 300/day is a *weeks-to-months* goal driven mostly
by **backlinks and freshness**, not by more pages.

## The 15-day action checklist (owner work — not code)

These need a deployed domain (see docs/cc/digitalocean.md) and accounts; they
can't be done from the repo.

**Day 0–1 — go live + verify**
- [ ] Deploy to the production domain (HTTPS). Set `NEXT_PUBLIC_SITE_URL`.
- [ ] Create **Google Search Console** + **Bing Webmaster Tools**; verify the domain.
- [ ] Submit `sitemap.xml` and `feed.xml` in both.
- [ ] **IndexNow is built in** — the key is served at `/indexnow-key.txt`. Submit
      every URL instantly with `SITE_URL=https://your-domain npm run seo:indexnow`
      (Bing/Yandex; Bing powers ChatGPT search). Re-run it whenever content changes.

**Day 1–3 — prioritise indexing**
- [ ] In GSC, use URL Inspection → "Request indexing" for the ~25 cornerstone
      pages (3 country pillars, visa, proof-of-funds, GIC, SDS, intakes, PGWP).
- [ ] Confirm `llms.txt` and structured data validate (Rich Results Test).
- [ ] Add the site to Google Business / relevant directories for first citations.

**Day 3–10 — links + distribution (the real lever)**
- [ ] Answer real questions on Reddit (r/ApplyingToCollege, r/ImmigrationCanada,
      country subreddits), Quora, and Facebook study-abroad groups — link the
      *specific* guide that answers each, not the homepage. (Value first, no spam.)
- [ ] Publish 3–4 cornerstone guides as LinkedIn/Medium articles linking back.
- [ ] Outreach to 10–20 agents/bloggers/student communities for a link or mention.
- [ ] Get listed in 5–10 study-abroad directories.

**Day 10–15 — freshness + iterate**
- [ ] Check GSC "Performance" → impressions/queries; expand the pages already
      getting impressions (more depth, more FAQs, internal links).
- [ ] Fix any "Discovered – not indexed" by improving internal links to those URLs.
- [ ] Publish a couple of genuinely new, timely posts (e.g. latest IRCC change) —
      freshness compounds.

## Keep it out of "AI slop" territory (ongoing)
- Update `src/content/seo/data.ts` whenever IRCC rules change — every page updates.
- Add real, first-hand specifics over time (student stories, screenshots, exact
  fees per programme) to deepen the highest-traffic pages.
- Never publish a guarantee of admission/scholarship/visa — it's false and it
  erodes trust (and the brand voice forbids it).

## Measuring success
- GSC impressions/clicks by query and page.
- AI referrals: track `utm`/referrer for chatgpt.com, perplexity.ai, gemini.
- Indexed count (GSC Coverage) trending toward 610.
- The honest KPI for week 2 is *indexed + first impressions + first long-tail
  clicks + first AI citations* — not 300/day. That target is a 2–3 month outcome
  driven by the link-building above.
