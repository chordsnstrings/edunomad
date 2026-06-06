// EduNomad — SEO/LLM article generator.
//
// Composes the researched data layer (./data.ts) into 600+ specific, useful
// guide pages for the Bangladesh / India / Nepal → Canada corridors. This is
// programmatic SEO done the honest way: every page is built from REAL entities
// (named DLIs, verified IRCC facts, country-specific finance/NOC/refusal rules)
// with unique tables and FAQs — not spun filler. Phrasing varies per slug so
// pages don't share a template footprint.

import {
  SOURCE_COUNTRIES, CANADA, TESTS, SCHOLARSHIPS, CITIES, FIELDS, INSTITUTIONS,
  SOURCES, LAST_UPDATED, EXTRA, countryByCode, type CountryCode, type SourceCountry,
  type Institution,
} from "./data";

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "callout"; text: string };

export type Faq = { q: string; a: string };

export type Article = {
  slug: string;
  category: string;
  categoryLabel: string;
  country?: CountryCode;
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  blocks: Block[];
  faqs: Faq[];
  related: string[];
  updated: string;
};

// ── helpers ────────────────────────────────────────────────────────────────
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
/** Deterministic variant pick so pages read differently. */
function pick<T>(seed: string, arr: T[]): T {
  return arr[hash(seed) % arr.length];
}
const NO_GUARANTEE =
  "EduNomad guides and packages your file end to end, but admission and visa decisions rest with the institution and IRCC — we never promise an outcome we cannot control.";

const proof = `CAD ${CANADA.proofOfFundsCad.toLocaleString()} in living costs (CAD ${CANADA.proofOfFundsCadFromSep2026.toLocaleString()} for applications on or after 1 September 2026), on top of your first-year tuition`;

function feesTable(): Block {
  return {
    kind: "table",
    head: ["Item", "Approx. cost (CAD)"],
    rows: [
      ["Study permit application", `$${CANADA.studyPermitFeeCad}`],
      ["Biometrics", `$${CANADA.biometricsFeeCad}`],
      ["Proof of funds (living, year one)", `$${CANADA.proofOfFundsCad.toLocaleString()} → $${CANADA.proofOfFundsCadFromSep2026.toLocaleString()} from 1 Sep 2026`],
      ["GIC (releases monthly)", `~CAD ${CANADA.gicMonthlyReleaseCad}/month back to you`],
      ["Tuition (typical)", CANADA.tuitionRangeCad],
    ],
  };
}
function intakeTable(): Block {
  return {
    kind: "table",
    head: ["Intake", "What to know"],
    rows: CANADA.intakes.map((i) => [i.name, i.note]),
  };
}
function testTable(): Block {
  return {
    kind: "table",
    head: ["Test", "Typical score", "Study permit / PGWP", "Notes"],
    rows: TESTS.map((t) => [t.name, t.typical, t.forVisaPgwp, t.note]),
  };
}
function processSteps(c: SourceCountry): Block {
  return { kind: "ol", items: c.localSteps };
}
function pgwpBlocks(): Block[] {
  return [
    { kind: "h2", text: "Working after you graduate (PGWP) and the PR pathway" },
    { kind: "p", text: CANADA.pgwp.languageRule },
    { kind: "p", text: CANADA.pgwp.testRule },
    { kind: "p", text: CANADA.pgwp.fieldRule },
    { kind: "callout", text: CANADA.pgwp.prPath },
  ];
}

function makeArticle(a: Omit<Article, "updated">): Article {
  return { ...a, updated: LAST_UPDATED };
}

const all: Article[] = [];

// ── Category 1: country pillar guides (24 × 3) ─────────────────────────────
type Pillar = (c: SourceCountry) => Omit<Article, "updated"> | null;

const PILLARS: { key: string; build: Pillar }[] = [
  {
    key: "study-in-canada-from",
    build: (c) => ({
      slug: `study-in-canada-from-${c.slug}`,
      category: "country", categoryLabel: "Country guide", country: c.code,
      title: `Study in Canada from ${c.name} (2026): Full Step-by-Step Guide`,
      description: `How ${c.demonym} students get to Canada in 2026 — costs, ${proofLocalShort(c)}, IELTS, the study permit after SDS ended, top universities and the PGWP-to-PR pathway.`,
      keywords: [`study in canada from ${c.name.toLowerCase()}`, `canada student visa from ${c.name.toLowerCase()}`, `study in canada for ${c.demonym.toLowerCase()} students`],
      intro: pick(c.slug, [
        `Canada remains the most asked-about destination for ${c.demonym} students — for the post-study work permit, clear PR routes and GIC-backed visa proof. This guide walks the whole journey in plain language, with the 2026 rules that actually apply to you.`,
        `If you are a ${c.demonym} student weighing Canada, the rules changed a lot recently: SDS is gone, proof of funds went up, and the PGWP now needs a language test. Here is the current, end-to-end picture.`,
      ]),
      blocks: [
        { kind: "h2", text: `Why Canada for ${c.demonym} students` },
        { kind: "p", text: `Three- and four-year post-study work, a study-to-PR pipeline (PGWP → skilled work → Express Entry/PNP), and globally recognised degrees make Canada a long-game choice rather than a one-degree trip.` },
        { kind: "h2", text: "Entry requirements at a glance" },
        { kind: "ul", items: [
          `Academics: a recognised secondary certificate for diplomas/bachelor's; a bachelor's for master's. ${c.ieltsTypical}.`,
          `English: ${c.ieltsTypical}.`,
          `Money: show ${proof}.`,
          c.specialDoc ? `${c.specialDoc.name}: ${c.specialDoc.detail}` : `A clean, explainable source of funds is essential.`,
        ] },
        { kind: "h2", text: "What it costs" },
        feesTable(),
        { kind: "h2", text: "The 2026 study permit, step by step" },
        { kind: "p", text: CANADA.sds },
        processSteps(c),
        { kind: "callout", text: CANADA.pal },
        { kind: "h2", text: "Intakes and when to apply" },
        intakeTable(),
        ...pgwpBlocks(),
        { kind: "h2", text: "How EduNomad helps" },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: `Is SDS still available for ${c.demonym} students in 2026?`, a: CANADA.sds },
        { q: `How much money do I need to study in Canada from ${c.name}?`, a: `You show first-year tuition plus ${proof}. For ${c.name}, that's ${c.proofOfFundsLocal}.` },
        { q: `Can I study in Canada without IELTS from ${c.name}?`, a: `Sometimes for admission — via a medium-of-instruction letter or the Duolingo English Test at institutions that accept them — but IRCC and the PGWP still expect an approved test (IELTS/PTE).` },
        { q: `How long does the study permit take?`, a: `Around ${CANADA.processingWeeks}. Apply at least three months before your start date.` },
      ],
      related: [`canada-student-visa-from-${c.slug}`, `cost-of-studying-in-canada-from-${c.slug}`, `scholarships-in-canada-for-${c.slug}-students`, `gic-canada-for-${c.slug}-students`],
    }),
  },
  {
    key: "canada-student-visa-from",
    build: (c) => ({
      slug: `canada-student-visa-from-${c.slug}`,
      category: "visa", categoryLabel: "Visa guide", country: c.code,
      title: `Canada Student Visa from ${c.name}: 2026 Requirements & Process`,
      description: `The complete ${c.demonym} study-permit checklist for 2026 — documents, ${proofLocalShort(c)}, biometrics at ${c.visaCentre}, processing time and how to avoid a refusal.`,
      keywords: [`canada student visa from ${c.name.toLowerCase()}`, `canada study permit ${c.name.toLowerCase()}`, `canada visa requirements ${c.demonym.toLowerCase()} students`],
      intro: `A Canadian "student visa" is really a study permit (plus a temporary resident visa to travel). Here's exactly what ${c.demonym} applicants submit in 2026, and the mistakes that cause refusals.`,
      blocks: [
        { kind: "h2", text: "Documents you submit" },
        { kind: "ul", items: [
          "Valid passport", "Letter of Acceptance (LOA) from a DLI",
          `Proof of funds — ${proof}`,
          "GIC certificate and/or tuition-payment receipt",
          c.specialDoc ? c.specialDoc.name : "Source-of-funds evidence",
          "Statement of Purpose (study plan)", "Academic transcripts and certificates",
          "English test results (IELTS/PTE) or accepted alternative", "Medical exam (upfront) and biometrics",
        ] },
        { kind: "callout", text: CANADA.pal },
        { kind: "h2", text: "Step by step from " + c.name },
        processSteps(c),
        { kind: "h2", text: "Fees and processing time" },
        feesTable(),
        { kind: "p", text: `Plan for ${CANADA.processingWeeks}. ${CANADA.sds}` },
        { kind: "h2", text: "Why files get refused (and how to fix it)" },
        { kind: "ul", items: c.refusalReasons },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: `Where do ${c.demonym} students give biometrics?`, a: `At ${c.visaCentre}.` },
        { q: "Do I need a medical exam?", a: "Yes — complete an upfront medical with an IRCC panel physician before or with your application." },
        { q: "What's the visa fee?", a: `CAD ${CANADA.studyPermitFeeCad} for the study permit plus CAD ${CANADA.biometricsFeeCad} for biometrics.` },
        ...(c.specialDoc ? [{ q: `Is a ${c.specialDoc.name} required?`, a: c.specialDoc.detail }] : []),
      ],
      related: [`study-in-canada-from-${c.slug}`, `canada-study-visa-documents-checklist-${c.slug}`, `canada-student-visa-refusal-reasons-${c.slug}`, `proof-of-funds-canada-study-visa-${c.slug}`],
    }),
  },
  {
    key: "cost-of-studying-in-canada-from",
    build: (c) => ({
      slug: `cost-of-studying-in-canada-from-${c.slug}`,
      category: "cost", categoryLabel: "Cost guide", country: c.code,
      title: `Cost of Studying in Canada from ${c.name} (2026): Tuition + Living`,
      description: `A realistic 2026 budget for ${c.demonym} students — tuition, ${proof.toLowerCase()}, GIC, flights, insurance and city-by-city living costs.`,
      keywords: [`cost of studying in canada from ${c.name.toLowerCase()}`, `canada study cost for ${c.demonym.toLowerCase()} students`, `canada tuition living cost ${c.name.toLowerCase()}`],
      intro: `Budgeting honestly up front is the single best way to protect your visa file. Here's what a year in Canada really costs a ${c.demonym} student in 2026 — and where you can save.`,
      blocks: [
        { kind: "h2", text: "The headline numbers" },
        feesTable(),
        { kind: "p", text: `For ${c.name}, the living-cost proof works out to roughly ${c.proofOfFundsLocal}.` },
        { kind: "h2", text: "Living costs by city" },
        { kind: "table", head: ["City", "Province", "Monthly living (CAD)"], rows: CITIES.map((ci) => [ci.name, ci.province, ci.monthly]) },
        { kind: "h2", text: "How to fund it" },
        { kind: "ul", items: c.financeNotes },
        { kind: "p", text: c.loanNote },
        { kind: "h2", text: "Ways to lower the bill" },
        { kind: "ul", items: [
          "Pick affordable cities (Winnipeg, Saskatoon, St. John's) and lower-tuition public colleges.",
          "Apply for entrance scholarships listed in your offer letter.",
          `Work up to ${CANADA.weeklyWorkHours} hours/week during studies once eligible.`,
          "Share accommodation and buy a transit pass.",
        ] },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: `What is the total first-year cost from ${c.name}?`, a: `Plan for roughly CAD 30,000–55,000 all-in (tuition + living + GIC), depending on city and institution.` },
        { q: "Is the GIC part of the cost?", a: `The GIC isn't an extra cost — it's your own money, locked then released to you at ~CAD ${CANADA.gicMonthlyReleaseCad}/month.` },
        { q: "Which Canadian cities are cheapest?", a: "Winnipeg, Saskatoon, Regina and St. John's are consistently among the most affordable." },
      ],
      related: [`gic-canada-for-${c.slug}-students`, `cheapest-universities-in-canada-for-${c.slug}-students`, `study-in-canada-from-${c.slug}`, `scholarships-in-canada-for-${c.slug}-students`],
    }),
  },
  {
    key: "proof-of-funds-canada-study-visa",
    build: (c) => ({
      slug: `proof-of-funds-canada-study-visa-${c.slug}`,
      category: "funds", categoryLabel: "Funds guide", country: c.code,
      title: `Proof of Funds for Canada Study Visa from ${c.name} (2026)`,
      description: `Exactly how much money ${c.demonym} students must show for a Canada study permit in 2026 (${proofLocalShort(c)}), what counts, and how to document the source.`,
      keywords: [`proof of funds canada student visa ${c.name.toLowerCase()}`, `how much bank balance for canada student visa from ${c.name.toLowerCase()}`, `canada study permit funds ${c.demonym.toLowerCase()}`],
      intro: `Money is where most ${c.demonym} files are won or lost. IRCC isn't only checking the amount — it's checking that the funds are real, yours, and explainable.`,
      blocks: [
        { kind: "h2", text: "How much you must show" },
        { kind: "p", text: `First-year tuition plus ${proof}. For ${c.name} that's about ${c.proofOfFundsLocal}.` },
        { kind: "h2", text: "What counts as proof" },
        { kind: "ul", items: ["A GIC from an eligible Canadian bank (cleanest single proof)", "Bank statements showing a consistent six-month history", "An education-loan sanction letter covering tuition + living", "Sponsor income, tax returns and property valuations", "Scholarship or assistantship letters"] },
        ...(c.specialDoc ? [{ kind: "callout" as const, text: `${c.specialDoc.name}: ${c.specialDoc.detail}` }] : []),
        { kind: "h2", text: "Document the source — don't just show a balance" },
        { kind: "ul", items: c.financeNotes },
        { kind: "h2", text: "Funds mistakes that trigger refusals" },
        { kind: "ul", items: c.refusalReasons },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: `How much bank balance is needed for a Canada student visa from ${c.name}?`, a: `Tuition + ${proof} — about ${c.proofOfFundsLocal} for the living portion.` },
        { q: "Is a GIC mandatory?", a: "No, but it's the strongest single proof and the easiest for IRCC to verify since SDS ended." },
        { q: "Can I show a loan instead of savings?", a: "Yes — a sanctioned education loan that clearly covers year-one tuition and living is widely accepted." },
      ],
      related: [`gic-canada-for-${c.slug}-students`, `bank-statement-for-canada-student-visa-${c.slug}`, `canada-student-visa-from-${c.slug}`, `cost-of-studying-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "gic-canada-for",
    build: (c) => ({
      slug: `gic-canada-for-${c.slug}-students`,
      category: "funds", categoryLabel: "Funds guide", country: c.code,
      title: `GIC for Canada from ${c.name} (2026): Amount, Banks & How to Open`,
      description: `The 2026 GIC guide for ${c.demonym} students — how much (CAD ${CANADA.proofOfFundsCad.toLocaleString()}+), which banks, how it's released, and how it fits your study permit after SDS ended.`,
      keywords: [`gic canada ${c.name.toLowerCase()}`, `guaranteed investment certificate canada ${c.demonym.toLowerCase()}`, `how to open gic canada from ${c.name.toLowerCase()}`],
      intro: `A GIC (Guaranteed Investment Certificate) is the cleanest way for ${c.demonym} students to prove living funds. You deposit a set amount before you apply; the bank releases it to you in monthly instalments after you land.`,
      blocks: [
        { kind: "h2", text: "How much and how it's released" },
        { kind: "p", text: `Deposit CAD ${CANADA.proofOfFundsCad.toLocaleString()} (CAD ${CANADA.proofOfFundsCadFromSep2026.toLocaleString()} from 1 September 2026). It's returned to you at roughly CAD ${CANADA.gicMonthlyReleaseCad} per month across your first year.` },
        { kind: "h2", text: "Eligible banks" },
        { kind: "ul", items: CANADA.gicBanks.map((b) => `${b} — offers a student GIC for international applicants`) },
        { kind: "h2", text: `Opening a GIC from ${c.name}` },
        { kind: "ol", items: ["Choose an eligible bank and start the student GIC application online", "Transfer the funds (observe any local clearance — e.g. NOC in Nepal)", "Receive the GIC certificate / Investment Directions Confirmation", "Attach it to your study permit application as proof of funds"] },
        { kind: "p", text: c.loanNote },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Is the GIC refundable?", a: "It's your money — released to you monthly once you arrive and activate the account." },
        { q: "Do I still need a GIC now that SDS ended?", a: "It isn't mandatory, but it remains the strongest, fastest-to-verify proof of living funds." },
        { q: `Which banks do ${c.demonym} students use?`, a: CANADA.gicBanks.join(", ") + "." },
      ],
      related: [`proof-of-funds-canada-study-visa-${c.slug}`, `cost-of-studying-in-canada-from-${c.slug}`, `canada-student-visa-from-${c.slug}`, `study-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "ielts-requirements-canada",
    build: (c) => ({
      slug: `ielts-requirements-for-canada-from-${c.slug}`,
      category: "tests", categoryLabel: "English test", country: c.code,
      title: `IELTS Requirements for Canada from ${c.name} (2026)`,
      description: `IELTS bands ${c.demonym} students need for Canadian admission and the study permit in 2026, plus PTE/Duolingo/MOI alternatives and the PGWP language rule.`,
      keywords: [`ielts requirements canada ${c.name.toLowerCase()}`, `ielts band for canada student visa ${c.demonym.toLowerCase()}`, `english requirements canada ${c.name.toLowerCase()}`],
      intro: `${c.ieltsTypical} — but the test you need depends on whether it's for admission, the study permit, or the PGWP later. Here's the full picture for ${c.demonym} students.`,
      blocks: [
        { kind: "h2", text: "Bands by programme level" },
        { kind: "p", text: c.ieltsTypical },
        { kind: "h2", text: "Which test for which step" },
        testTable(),
        { kind: "callout", text: CANADA.pgwp.testRule },
        { kind: "h2", text: "No IELTS? Your options" },
        { kind: "ul", items: ["Medium-of-instruction (MOI) letter — accepted by some institutions for admission only", "Duolingo English Test — quick and cheap, accepted for admission at 400+ DLIs, but not by IRCC", "PTE Academic — fast results, widely accepted"] },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: `What IELTS score do ${c.demonym} students need for Canada?`, a: c.ieltsTypical },
        { q: "Is IELTS Academic or General Training for the PGWP?", a: "General Training — IELTS Academic is not accepted for the PGWP language requirement." },
        { q: `Can I study in Canada without IELTS from ${c.name}?`, a: "For admission, sometimes (MOI/Duolingo). For the permit and PGWP, plan on IELTS or PTE." },
      ],
      related: [`study-in-canada-without-ielts-from-${c.slug}`, `study-in-canada-from-${c.slug}`, `duolingo-accepted-universities-in-canada`, `ielts-vs-pte-vs-duolingo-for-canada`],
    }),
  },
  {
    key: "study-without-ielts",
    build: (c) => ({
      slug: `study-in-canada-without-ielts-from-${c.slug}`,
      category: "tests", categoryLabel: "English test", country: c.code,
      title: `Study in Canada Without IELTS from ${c.name} (2026): Real Options`,
      description: `Can ${c.demonym} students go to Canada without IELTS in 2026? Honest answers on MOI letters, the Duolingo English Test, PTE — and why the study permit still needs a test.`,
      keywords: [`study in canada without ielts from ${c.name.toLowerCase()}`, `canada without ielts ${c.demonym.toLowerCase()}`, `moi accepted universities canada`],
      intro: `"Without IELTS" usually means "without IELTS for admission" — not "without any English test for the visa". Here's what's actually possible for ${c.demonym} students.`,
      blocks: [
        { kind: "h2", text: "What genuinely works" },
        { kind: "ul", items: ["MOI letter (admission only) where the institution accepts it", "Duolingo English Test for a conditional/admission offer", "PTE Academic as a full IELTS alternative for admission"] },
        { kind: "callout", text: "IRCC does not accept the Duolingo English Test for the study permit, and the PGWP needs IELTS General Training, CELPIP or PTE Core. Plan a recognised test even if your admission waives one." },
        { kind: "h2", text: "Test comparison" },
        testTable(),
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Can I get a Canadian study permit with only Duolingo?", a: "No — IRCC doesn't accept Duolingo. Use it for admission, then take IELTS/PTE for the permit and PGWP." },
        { q: "Is an MOI letter enough?", a: "Only for admission at institutions that accept it — never for the PGWP." },
      ],
      related: [`ielts-requirements-for-canada-from-${c.slug}`, `duolingo-accepted-universities-in-canada`, `moi-vs-ielts-for-canada`, `study-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "sop",
    build: (c) => ({
      slug: `sop-for-canada-student-visa-from-${c.slug}`,
      category: "visa", categoryLabel: "Visa guide", country: c.code,
      title: `SOP for Canada Student Visa from ${c.name} (2026): Structure + Tips`,
      description: `How ${c.demonym} students write a Statement of Purpose that survives IRCC scrutiny in 2026 — structure, what to include, and the lines that cause refusals.`,
      keywords: [`sop for canada student visa ${c.name.toLowerCase()}`, `statement of purpose canada ${c.demonym.toLowerCase()}`, `sop sample canada study permit ${c.name.toLowerCase()}`],
      intro: `Your SOP (also called a Letter of Explanation) is where a visa officer decides whether your plan is genuine. For ${c.demonym} students it has to connect your past, your course choice and a clear plan back home.`,
      blocks: [
        { kind: "h2", text: "A structure that works" },
        { kind: "ol", items: ["Your academic and work background", "Why this exact programme and institution", "Why Canada (not just any country)", "How you'll fund it — tie to your proof of funds", "Your career plan and ties after studies"] },
        { kind: "h2", text: "Lines that get files refused" },
        { kind: "ul", items: c.refusalReasons },
        { kind: "callout", text: "Never copy a template SOP. Officers see thousands; a generic, AI-spun letter reads as a red flag." },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "How long should a Canada SOP be?", a: "Usually 1–2 pages (700–1,200 words) — specific and honest beats long and generic." },
        { q: "Should I explain a study gap?", a: "Yes — address gaps, backlogs and course changes directly; silence invites doubt." },
      ],
      related: [`canada-student-visa-from-${c.slug}`, `canada-student-visa-refusal-reasons-${c.slug}`, `canada-study-visa-documents-checklist-${c.slug}`, `study-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "documents-checklist",
    build: (c) => ({
      slug: `canada-study-visa-documents-checklist-${c.slug}`,
      category: "visa", categoryLabel: "Visa guide", country: c.code,
      title: `Canada Study Visa Document Checklist for ${c.name} (2026)`,
      description: `The complete 2026 document checklist for a ${c.demonym} Canada study permit — academics, funds, ${c.specialDoc ? c.specialDoc.name + ", " : ""}SOP, medical and biometrics.`,
      keywords: [`canada study visa documents ${c.name.toLowerCase()}`, `canada student visa checklist ${c.demonym.toLowerCase()}`, `documents for canada study permit ${c.name.toLowerCase()}`],
      intro: `Print this and tick it off. A complete, consistent file is the fastest route through the regular study-permit stream for ${c.demonym} applicants.`,
      blocks: [
        { kind: "h2", text: "Core documents" },
        { kind: "ul", items: ["Passport (valid for your whole stay)", "Letter of Acceptance from a DLI", "Provincial/Territorial Attestation Letter (PAL/TAL) where required", `Proof of funds — ${proof}`, "GIC certificate / tuition receipt", "Academic transcripts and certificates", "English test (IELTS/PTE) or accepted alternative", "Statement of Purpose", "Passport photos", "Medical exam confirmation", "Biometrics"] },
        ...(c.specialDoc ? [{ kind: "callout" as const, text: `${c.demonym} applicants also need a ${c.specialDoc.name}. ${c.specialDoc.detail}` }] : []),
        { kind: "h2", text: "Order of operations" },
        processSteps(c),
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Do I need a PAL?", a: CANADA.pal },
        ...(c.specialDoc ? [{ q: `Is a ${c.specialDoc.name} on the checklist?`, a: c.specialDoc.detail }] : []),
        { q: "When do I book the medical?", a: "Do the upfront medical with an IRCC panel physician before or alongside your application to save weeks." },
      ],
      related: [`canada-student-visa-from-${c.slug}`, `sop-for-canada-student-visa-from-${c.slug}`, `proof-of-funds-canada-study-visa-${c.slug}`, `canada-student-visa-refusal-reasons-${c.slug}`],
    }),
  },
  {
    key: "refusal-reasons",
    build: (c) => ({
      slug: `canada-student-visa-refusal-reasons-${c.slug}`,
      category: "visa", categoryLabel: "Visa guide", country: c.code,
      title: `Canada Study Visa Refusal Reasons for ${c.name} (2026) & Fixes`,
      description: `The most common reasons ${c.demonym} students get a Canada study permit refusal in 2026 — funds, SOP, ties — and how to fix or reapply.`,
      keywords: [`canada student visa refusal reasons ${c.name.toLowerCase()}`, `canada study permit rejected ${c.demonym.toLowerCase()}`, `canada visa refusal reapply ${c.name.toLowerCase()}`],
      intro: `Most refusals come down to a handful of fixable issues. Here's what officers flag for ${c.demonym} applicants — and what a strong reapplication looks like.`,
      blocks: [
        { kind: "h2", text: "Top refusal triggers" },
        { kind: "ul", items: c.refusalReasons },
        { kind: "h2", text: "How to reapply well" },
        { kind: "ol", items: ["Get your GCMS notes to see the officer's actual concern", "Fix the specific issue (funds source, SOP ties, course fit) — don't just resubmit", "Strengthen the financial trail and the study plan", "Reapply with a clear, addressed Letter of Explanation"] },
        { kind: "callout", text: "A refusal is not a ban. A well-diagnosed reapplication is often successful." },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Can I reapply after a refusal?", a: "Yes — diagnose the exact reason (GCMS notes help), fix it, and reapply." },
        { q: "Does one refusal hurt future applications?", a: "You must declare it, but a refusal that's properly addressed doesn't doom a stronger file." },
      ],
      related: [`canada-student-visa-from-${c.slug}`, `proof-of-funds-canada-study-visa-${c.slug}`, `sop-for-canada-student-visa-from-${c.slug}`, `bank-statement-for-canada-student-visa-${c.slug}`],
    }),
  },
  {
    key: "bank-statement",
    build: (c) => ({
      slug: `bank-statement-for-canada-student-visa-${c.slug}`,
      category: "funds", categoryLabel: "Funds guide", country: c.code,
      title: `Bank Statement for Canada Student Visa from ${c.name} (2026)`,
      description: `How ${c.demonym} students prepare bank statements for a Canada study permit — history, source of funds, and the deposits that cause refusals.`,
      keywords: [`bank statement for canada student visa ${c.name.toLowerCase()}`, `canada study permit bank statement ${c.demonym.toLowerCase()}`, `source of funds canada visa ${c.name.toLowerCase()}`],
      intro: `IRCC reads your bank statements like a story. For ${c.demonym} applicants, consistency and a clear source matter more than a big final number.`,
      blocks: [
        { kind: "h2", text: "What officers want to see" },
        { kind: "ul", items: ["A consistent history (typically six months)", "Funds that match your declared income and sponsor", "No unexplained large or third-party deposits", "Balances that comfortably cover tuition + living"] },
        ...(c.specialDoc ? [{ kind: "callout" as const, text: `${c.specialDoc.name}: ${c.specialDoc.detail}` }] : []),
        { kind: "h2", text: "Make the source obvious" },
        { kind: "ul", items: c.financeNotes },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "How many months of statements do I need?", a: "Usually six months of consistent history, plus evidence of where the money came from." },
        { q: "Can I deposit a lump sum just before applying?", a: "It's risky — a sudden unexplained deposit is a leading refusal trigger. Document the source." },
      ],
      related: [`proof-of-funds-canada-study-visa-${c.slug}`, `gic-canada-for-${c.slug}-students`, `canada-student-visa-refusal-reasons-${c.slug}`, `cost-of-studying-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "scholarships",
    build: (c) => ({
      slug: `scholarships-in-canada-for-${c.slug}-students`,
      category: "scholarships", categoryLabel: "Scholarships", country: c.code,
      title: `Scholarships in Canada for ${c.demonym} Students (2026)`,
      description: `Government, university and entrance scholarships ${c.demonym} students can target in 2026 — amounts, who they're for, and how to actually win one.`,
      keywords: [`scholarships in canada for ${c.demonym.toLowerCase()} students`, `canada scholarship ${c.name.toLowerCase()} 2026`, `fully funded scholarship canada ${c.demonym.toLowerCase()}`],
      intro: `Funding rarely covers everything, but the right scholarship can cut your bill — and strengthen your visa file. Here's what ${c.demonym} students can realistically pursue.`,
      blocks: [
        { kind: "h2", text: "Scholarships worth targeting" },
        { kind: "table", head: ["Scholarship", "Level", "Amount", "Who it's for"], rows: SCHOLARSHIPS.map((s) => [s.name, s.level, s.amount, s.who]) },
        { kind: "h2", text: "How to actually win one" },
        { kind: "ul", items: ["Apply early — many entrance awards are automatic on a strong application", "Lead with measurable achievements and a clear study plan", "Target master's/PhD research funding if you have a strong CGPA", "Always read the offer letter — entrance scholarships are often listed there"] },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: `Are there fully funded scholarships for ${c.demonym} students?`, a: "Yes at the graduate level (e.g., Vanier, Lester B. Pearson) — they're highly competitive and merit-based." },
        { q: "Do scholarships help my visa?", a: "Yes — a scholarship letter is accepted proof of funds and reduces the amount you must show." },
      ],
      related: [`study-in-canada-from-${c.slug}`, `cost-of-studying-in-canada-from-${c.slug}`, `cheapest-universities-in-canada-for-${c.slug}-students`, `gic-canada-for-${c.slug}-students`],
    }),
  },
  {
    key: "pgwp-pr",
    build: (c) => ({
      slug: `pgwp-and-pr-after-studying-in-canada-${c.slug}`,
      category: "pr", categoryLabel: "Work & PR", country: c.code,
      title: `PGWP & PR After Studying in Canada (2026): ${c.name} Guide`,
      description: `How ${c.demonym} graduates turn a Canadian education into a work permit and permanent residency in 2026 — PGWP language/field rules, then Express Entry/PNP.`,
      keywords: [`pgwp after study canada ${c.name.toLowerCase()}`, `pr after study in canada ${c.demonym.toLowerCase()}`, `canada study to pr ${c.name.toLowerCase()}`],
      intro: `For most ${c.demonym} students the real goal is staying and working. The study-to-PR pipeline still exists in 2026 — but the PGWP rules tightened, so course choice matters more than ever.`,
      blocks: pgwpBlocks().concat([
        { kind: "h2", text: "Plan your course for PR, not just admission" },
        { kind: "ul", items: ["University degrees keep PGWP options open without a field-of-study list", "For college diplomas, confirm the programme is in an IRCC-eligible field", "Aim for jobs in TEER 0/1/2/3 to build qualifying experience", "Watch province-specific PNP streams for graduates"] },
        { kind: "p", text: NO_GUARANTEE },
      ]),
      faqs: [
        { q: "Does every course qualify for a PGWP?", a: CANADA.pgwp.fieldRule },
        { q: "What language score do I need for the PGWP?", a: CANADA.pgwp.languageRule },
        { q: "How do I go from PGWP to PR?", a: CANADA.pgwp.prPath },
      ],
      related: [`study-in-canada-from-${c.slug}`, `best-courses-to-study-in-canada-for-${c.slug}-students`, `cheapest-universities-in-canada-for-${c.slug}-students`, `canada-student-visa-from-${c.slug}`],
    }),
  },
  {
    key: "intakes",
    build: (c) => ({
      slug: `canada-intakes-2026-for-${c.slug}-students`,
      category: "planning", categoryLabel: "Planning", country: c.code,
      title: `Canada Intakes 2026 for ${c.demonym} Students: Dates & Deadlines`,
      description: `Fall, Winter and Spring intakes explained for ${c.demonym} students — application windows, which to pick, and how the PAL cap affects timing.`,
      keywords: [`canada intakes 2026 ${c.name.toLowerCase()}`, `canada fall intake ${c.demonym.toLowerCase()}`, `best intake canada ${c.name.toLowerCase()}`],
      intro: `Timing decides everything — scholarships, PAL availability and processing buffer. Here's how ${c.demonym} students should plan the 2026 intakes.`,
      blocks: [
        { kind: "h2", text: "The three intakes" },
        intakeTable(),
        { kind: "callout", text: CANADA.cap },
        { kind: "h2", text: "Build your timeline backwards" },
        { kind: "ol", items: ["Pick your intake and find each programme's deadline", `Leave ${CANADA.processingWeeks} for the study permit`, "Sit your English test 3–4 months earlier", "Arrange funds/GIC and (if applicable) the NOC before you apply"] },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Which intake is best?", a: "Fall (September) has the most programmes and scholarships; Winter (January) has less competition." },
        { q: "How early should I start?", a: "8–12 months ahead — earlier if you need scholarships or a popular programme." },
      ],
      related: [`how-to-apply-for-canada-student-visa-from-${c.slug}`, `study-in-canada-from-${c.slug}`, `canada-study-permit-processing-time-${c.slug}`, `scholarships-in-canada-for-${c.slug}-students`],
    }),
  },
  {
    key: "how-to-apply",
    build: (c) => ({
      slug: `how-to-apply-for-canada-student-visa-from-${c.slug}`,
      category: "visa", categoryLabel: "Visa guide", country: c.code,
      title: `How to Apply for a Canada Student Visa from ${c.name} (2026)`,
      description: `A step-by-step 2026 walkthrough for ${c.demonym} students — from English test and LOA to GIC, ${c.specialDoc ? c.specialDoc.name + ", " : ""}medical, biometrics and the IRCC portal.`,
      keywords: [`how to apply canada student visa from ${c.name.toLowerCase()}`, `canada study permit process ${c.demonym.toLowerCase()}`, `apply canada student visa ${c.name.toLowerCase()} step by step`],
      intro: `Here's the exact order ${c.demonym} students should follow in 2026 so nothing blocks your file at the last minute.`,
      blocks: [
        { kind: "h2", text: "Step by step" },
        processSteps(c),
        { kind: "callout", text: CANADA.sds },
        { kind: "h2", text: "Fees" },
        feesTable(),
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Where do I apply?", a: "Online through the IRCC secure account; biometrics at " + c.visaCentre + "." },
        { q: "How long does it take?", a: CANADA.processingWeeks + " — apply at least three months before your start date." },
      ],
      related: [`canada-student-visa-from-${c.slug}`, `canada-study-visa-documents-checklist-${c.slug}`, `canada-study-permit-processing-time-${c.slug}`, `study-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "processing-time",
    build: (c) => ({
      slug: `canada-study-permit-processing-time-${c.slug}`,
      category: "visa", categoryLabel: "Visa guide", country: c.code,
      title: `Canada Study Permit Processing Time from ${c.name} (2026)`,
      description: `How long the Canada study permit takes for ${c.demonym} students in 2026 now that SDS has ended, and how to avoid delays.`,
      keywords: [`canada study permit processing time ${c.name.toLowerCase()}`, `canada student visa time ${c.demonym.toLowerCase()}`, `how long canada study visa ${c.name.toLowerCase()}`],
      intro: `Since SDS ended, ${c.demonym} applicants use the regular stream. Plan your timeline around it, not the old 20-day myth.`,
      blocks: [
        { kind: "h2", text: "Current timing" },
        { kind: "p", text: `${CANADA.sds} Expect ${CANADA.processingWeeks}.` },
        { kind: "h2", text: "What speeds you up" },
        { kind: "ul", items: ["A complete, consistent file (no follow-up requests)", "Upfront medical done before you apply", "Biometrics given promptly", "A GIC that's easy to verify"] },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Is there still a fast 20-day option?", a: "No — SDS ended on 8 November 2024. All applications use the regular stream." },
        { q: "How early should I apply?", a: "At least three months before your start date; earlier for Fall." },
      ],
      related: [`how-to-apply-for-canada-student-visa-from-${c.slug}`, `canada-intakes-2026-for-${c.slug}-students`, `canada-student-visa-from-${c.slug}`, `study-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "cheapest-universities",
    build: (c) => ({
      slug: `cheapest-universities-in-canada-for-${c.slug}-students`,
      category: "lists", categoryLabel: "Best-of list", country: c.code,
      title: `Cheapest Universities in Canada for ${c.demonym} Students (2026)`,
      description: `Affordable Canadian universities and colleges for ${c.demonym} students in 2026 — honest tuition ranges, cities and PGWP notes.`,
      keywords: [`cheapest universities in canada for ${c.demonym.toLowerCase()} students`, `affordable universities canada ${c.name.toLowerCase()}`, `low tuition canada ${c.demonym.toLowerCase()}`],
      intro: `Lower tuition in an affordable city can cut your total cost by lakhs. These DLIs are consistently among the more affordable for ${c.demonym} students — always verify current fees on the official site.`,
      blocks: [
        { kind: "h2", text: "Affordable picks" },
        { kind: "table", head: ["Institution", "City", "Type", "Approx. tuition (CAD/yr)"], rows: INSTITUTIONS.filter((i) => affordable(i)).slice(0, 14).map((i) => [i.name, `${i.city}, ${i.province}`, i.type, i.tuition]) },
        { kind: "callout", text: "Tuition figures are approximate — confirm on each institution's official page before you apply." },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Are colleges cheaper than universities?", a: "Often yes — public-college diplomas typically run CAD 14,000–24,000/year. Confirm the programme is PGWP-eligible." },
        { q: "Which provinces are most affordable?", a: "Manitoba, Saskatchewan and Newfoundland generally have lower tuition and living costs." },
      ],
      related: [`cost-of-studying-in-canada-from-${c.slug}`, `scholarships-in-canada-for-${c.slug}-students`, `best-courses-to-study-in-canada-for-${c.slug}-students`, `study-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "best-courses",
    build: (c) => ({
      slug: `best-courses-to-study-in-canada-for-${c.slug}-students`,
      category: "lists", categoryLabel: "Best-of list", country: c.code,
      title: `Best Courses to Study in Canada for ${c.demonym} Students (2026)`,
      description: `In-demand courses for ${c.demonym} students in Canada in 2026 — fields with strong jobs and PGWP-to-PR alignment.`,
      keywords: [`best courses in canada for ${c.demonym.toLowerCase()} students`, `in demand courses canada ${c.name.toLowerCase()}`, `pgwp eligible courses canada ${c.demonym.toLowerCase()}`],
      intro: `The "best" course is the one with real jobs and a clean PGWP-to-PR path. These fields tick both for ${c.demonym} students.`,
      blocks: [
        { kind: "h2", text: "Fields worth shortlisting" },
        { kind: "table", head: ["Field", "Example careers", "Why it's strong"], rows: FIELDS.slice(0, 12).map((f) => [f.name, f.careers, f.note]) },
        { kind: "callout", text: CANADA.pgwp.fieldRule },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Which course gives the best PR chances?", a: "Fields mapping to TEER 0/1/2/3 jobs (tech, healthcare, skilled trades, business analytics) align best with Express Entry/PNP." },
        { q: "Do college diplomas qualify for PGWP?", a: CANADA.pgwp.fieldRule },
      ],
      related: [`pgwp-and-pr-after-studying-in-canada-${c.slug}`, `cheapest-universities-in-canada-for-${c.slug}-students`, `study-in-canada-from-${c.slug}`, `scholarships-in-canada-for-${c.slug}-students`],
    }),
  },
  {
    key: "education-loan",
    build: (c) => ({
      slug: `education-loan-for-canada-from-${c.slug}`,
      category: "funds", categoryLabel: "Funds guide", country: c.code,
      title: `Education Loan for Canada from ${c.name} (2026): Banks & Tips`,
      description: `How ${c.demonym} students finance Canada with an education loan in 2026 — what's covered, how it pairs with the GIC, and what IRCC wants to see.`,
      keywords: [`education loan for canada from ${c.name.toLowerCase()}`, `study loan canada ${c.demonym.toLowerCase()}`, `canada student loan ${c.name.toLowerCase()}`],
      intro: `A sanctioned loan that clearly covers year-one tuition and living is strong proof of funds. Here's how ${c.demonym} students structure it.`,
      blocks: [
        { kind: "h2", text: "What a good loan covers" },
        { kind: "ul", items: ["Tuition for year one (at least)", "Living costs / the GIC amount", "Airfare, insurance, laptop where allowed"] },
        { kind: "p", text: c.loanNote },
        { kind: "callout", text: "IRCC wants a sanction letter that explicitly covers tuition + living. A vague or partial loan weakens the file." },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Does a loan count as proof of funds?", a: "Yes — a sanctioned education loan covering year-one tuition and living is widely accepted." },
        { q: "Can the loan fund my GIC?", a: "Often yes — several lenders disburse the GIC amount directly to an approved Canadian bank." },
      ],
      related: [`proof-of-funds-canada-study-visa-${c.slug}`, `gic-canada-for-${c.slug}-students`, `cost-of-studying-in-canada-from-${c.slug}`, `study-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "after-landing",
    build: (c) => ({
      slug: `after-landing-in-canada-checklist-${c.slug}`,
      category: "planning", categoryLabel: "Planning", country: c.code,
      title: `After Landing in Canada: First-Week Checklist for ${c.demonym} Students`,
      description: `What ${c.demonym} students do in the first week in Canada — SIN, bank account, GIC activation, SIM, health card and housing.`,
      keywords: [`after landing in canada ${c.demonym.toLowerCase()}`, `first week in canada student ${c.name.toLowerCase()}`, `canada arrival checklist ${c.demonym.toLowerCase()}`],
      intro: `Your first week sets up everything — money, phone, health cover and work eligibility. Here's the order for ${c.demonym} students.`,
      blocks: [
        { kind: "h2", text: "Week one" },
        { kind: "ol", items: ["Activate your GIC account and collect the first instalment", "Apply for a SIN (needed to work)", "Get a Canadian SIM and a transit pass", "Register for the provincial health card", "Confirm housing and a permanent address", "Attend your institution's international orientation"] },
        { kind: "p", text: `Once eligible you can work up to ${CANADA.weeklyWorkHours} hours/week during studies.` },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "How soon can I work?", a: `Eligible study-permit holders can work up to ${CANADA.weeklyWorkHours} hours/week off-campus during the semester.` },
        { q: "When do I get my GIC money?", a: `Monthly after you activate the account — roughly CAD ${CANADA.gicMonthlyReleaseCad}.` },
      ],
      related: [`study-in-canada-from-${c.slug}`, `gic-canada-for-${c.slug}-students`, `pgwp-and-pr-after-studying-in-canada-${c.slug}`, `cost-of-studying-in-canada-from-${c.slug}`],
    }),
  },
  {
    key: "compare-destinations",
    build: (c) => ({
      slug: `canada-vs-uk-vs-australia-for-${c.slug}-students`,
      category: "compare", categoryLabel: "Comparison", country: c.code,
      title: `Canada vs UK vs Australia for ${c.demonym} Students (2026)`,
      description: `An honest 2026 comparison for ${c.demonym} students — cost, post-study work, PR pathways and visa difficulty across Canada, the UK and Australia.`,
      keywords: [`canada vs uk vs australia for ${c.demonym.toLowerCase()} students`, `best country to study abroad ${c.name.toLowerCase()}`, `canada or uk or australia ${c.demonym.toLowerCase()}`],
      intro: `There's no single "best" country — only the best fit for your budget and goals. Here's how the big three compare for ${c.demonym} students in 2026.`,
      blocks: [
        { kind: "h2", text: "Side by side" },
        { kind: "table", head: ["Factor", "Canada", "UK", "Australia"], rows: [
          ["Post-study work", "PGWP (up to 3 yrs)", "Graduate Route (2 yrs)", "Temporary Graduate (2–3 yrs)"],
          ["PR pathway", "Express Entry / PNP", "Skilled Worker route", "Skilled migration / state nomination"],
          ["Typical tuition/yr", "CAD 15k–60k", "£13k–30k", "AUD 20k–45k"],
          ["English for visa", "IELTS/PTE (GT for PGWP)", "IELTS UKVI", "IELTS/PTE"],
          ["Course length", "Diploma–Master's", "1-yr master's common", "Master's 1.5–2 yrs"],
        ] },
        { kind: "p", text: "Canada wins on PR runway and post-study work length; the UK on speed (one-year master's); Australia on work rights and lifestyle." },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: "Which is cheapest?", a: "It varies by city and course; affordable Canadian colleges and one-year UK master's can both lower total cost." },
        { q: "Which has the best PR path?", a: "Canada's study-to-PR pipeline (PGWP → Express Entry/PNP) is the most established for international graduates." },
      ],
      related: [`study-in-canada-from-${c.slug}`, `pgwp-and-pr-after-studying-in-canada-${c.slug}`, `cost-of-studying-in-canada-from-${c.slug}`, `best-courses-to-study-in-canada-for-${c.slug}-students`],
    }),
  },
];

function proofLocalShort(c: SourceCountry): string {
  return c.proofOfFundsLocal.split(" (")[0];
}
function affordable(i: Institution): boolean {
  const m = i.tuition.match(/[\d,]+/);
  if (!m) return false;
  return Number(m[0].replace(/,/g, "")) <= 25000;
}

for (const c of SOURCE_COUNTRIES) {
  for (const p of PILLARS) {
    const built = p.build(c);
    if (built) all.push(makeArticle(built));
  }
}

// ── Category 2: university × country (admission + finance) ──────────────────
for (const c of SOURCE_COUNTRIES) {
  for (const inst of INSTITUTIONS) {
    const isUni = inst.type === "university";
    all.push(makeArticle({
      slug: `study-at-${inst.slug}-from-${c.slug}`,
      category: "university", categoryLabel: "University guide", country: c.code,
      title: `${inst.name} for ${c.demonym} Students (2026): Fees, Courses, Admission`,
      description: `A 2026 guide to ${inst.name} (${inst.city}, ${inst.province}) for ${c.demonym} students — ${inst.tuition}/yr, popular programmes, English requirements and the PGWP angle.`,
      keywords: [`${inst.name.toLowerCase()} for ${c.demonym.toLowerCase()} students`, `${inst.name.toLowerCase()} fees international`, `study at ${inst.slug.replace(/-/g, " ")} from ${c.name.toLowerCase()}`],
      intro: pick(inst.slug + c.slug, [
        `${inst.name} is a ${inst.type} in ${inst.city}, ${inst.province}, and a regular choice for ${c.demonym} students. ${inst.note}`,
        `Considering ${inst.name} from ${c.name}? Here's the honest 2026 picture — fees, popular programmes, English bands and how the PGWP works for a ${inst.type}.`,
      ]),
      blocks: [
        { kind: "h2", text: "The essentials" },
        { kind: "table", head: ["Detail", "Value"], rows: [
          ["Location", `${inst.city}, ${inst.province}`],
          ["Type", inst.type === "university" ? "University (degree)" : "Public college / polytechnic (diploma & degree)"],
          ["Approx. tuition", `${inst.tuition}/year (verify on the official site)`],
          ["Popular programmes", inst.notable.join(", ")],
          ["Intakes", "Fall (Sep) and Winter (Jan); some Spring"],
        ] },
        { kind: "h2", text: `Why ${c.demonym} students pick it` },
        { kind: "p", text: inst.note },
        { kind: "h2", text: "English and admission" },
        { kind: "p", text: `${c.ieltsTypical} Many programmes also accept PTE; some accept the Duolingo English Test or an MOI letter for admission only.` },
        { kind: "h2", text: "Funding your place" },
        { kind: "ul", items: [`Budget ${inst.tuition}/year tuition plus ${proof}.`, ...c.financeNotes.slice(0, 2)] },
        isUni
          ? { kind: "callout", text: "As a university degree, graduates aren't subject to the PGWP field-of-study list — but the PGWP language test still applies." }
          : { kind: "callout", text: "For a college diploma, confirm the specific programme is in an IRCC-eligible field before you rely on a PGWP." },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: `What are ${inst.name}'s fees for international students?`, a: `Approximately ${inst.tuition}/year — confirm the exact programme fee on the official site.` },
        { q: `Does ${inst.name} support a PGWP?`, a: isUni ? "Yes — its degrees are PGWP-eligible (subject to the language test)." : "Public-college diplomas can be PGWP-eligible — confirm your specific programme is in an eligible field." },
        { q: `What English score do ${c.demonym} students need?`, a: c.ieltsTypical },
      ],
      related: [`study-in-canada-from-${c.slug}`, `cost-of-studying-in-canada-from-${c.slug}`, `${inst.slug}-international-students`, `cheapest-universities-in-canada-for-${c.slug}-students`],
    }));
  }
}

// ── Category 3: university base profiles ────────────────────────────────────
for (const inst of INSTITUTIONS) {
  all.push(makeArticle({
    slug: `${inst.slug}-international-students`,
    category: "university", categoryLabel: "University guide",
    title: `${inst.name} (${inst.city}): International Student Guide 2026`,
    description: `${inst.name} in ${inst.city}, ${inst.province} — international tuition (${inst.tuition}/yr), popular programmes (${inst.notable.join(", ")}), intakes and PGWP notes for 2026.`,
    keywords: [`${inst.name.toLowerCase()} international students`, `${inst.name.toLowerCase()} fees`, `${inst.name.toLowerCase()} admission requirements`],
    intro: `${inst.name} is a ${inst.type} in ${inst.city}, ${inst.province}. ${inst.note} Here's the 2026 international-student snapshot for Bangladeshi, Indian and Nepali applicants.`,
    blocks: [
      { kind: "h2", text: "Snapshot" },
      { kind: "table", head: ["Detail", "Value"], rows: [
        ["City", `${inst.city}, ${inst.province}`],
        ["Type", inst.type === "university" ? "University" : "Public college / polytechnic"],
        ["Approx. international tuition", `${inst.tuition}/year`],
        ["Popular programmes", inst.notable.join(", ")],
      ] },
      { kind: "h2", text: "Programmes students choose" },
      { kind: "ul", items: inst.notable.map((n) => `${n} — strong demand and clear career outcomes`) },
      { kind: "h2", text: "PGWP and the PR angle" },
      { kind: "p", text: inst.type === "university" ? "University degrees are PGWP-eligible without a field-of-study restriction (the language test still applies)." : "Confirm your specific public-college programme is in an IRCC-eligible field for a PGWP." },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [
      { q: `Where is ${inst.name}?`, a: `${inst.city}, ${inst.province}, Canada.` },
      { q: `What does ${inst.name} cost for international students?`, a: `Roughly ${inst.tuition}/year — verify the exact programme on the official site.` },
    ],
    related: [`study-at-${inst.slug}-from-bangladesh`, `study-at-${inst.slug}-from-india`, `study-at-${inst.slug}-from-nepal`, `study-in-canada-from-india`],
  }));
}

// ── Category 4: field × country (study) + field overview ───────────────────
for (const f of FIELDS) {
  all.push(makeArticle({
    slug: `study-${f.slug}-in-canada`,
    category: "field", categoryLabel: "Field guide",
    title: `Study ${f.name} in Canada (2026): Courses, Costs & Careers`,
    description: `A 2026 guide to studying ${f.name} in Canada — top institutions, costs, English bands, careers (${f.careers}) and the PGWP angle.`,
    keywords: [`study ${f.name.toLowerCase()} in canada`, `${f.name.toLowerCase()} courses canada international students`, `${f.name.toLowerCase()} jobs canada`],
    intro: `${f.name} is one of the most searched fields for South Asian students in Canada. ${f.note} Here's how to choose a programme that also sets up your PGWP and PR.`,
    blocks: [
      { kind: "h2", text: "Where to study it" },
      { kind: "ul", items: INSTITUTIONS.filter((i) => i.notable.some((n) => sameField(n, f.name))).slice(0, 8).map((i) => `${i.name} (${i.city}) — ${i.tuition}/yr`) },
      { kind: "h2", text: "Careers after graduation" },
      { kind: "p", text: `Typical roles: ${f.careers}.` },
      { kind: "callout", text: CANADA.pgwp.fieldRule },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [
      { q: `Is ${f.name} in demand in Canada?`, a: f.note },
      { q: `Does a ${f.name} diploma qualify for a PGWP?`, a: CANADA.pgwp.fieldRule },
    ],
    related: SOURCE_COUNTRIES.map((c) => `study-${f.slug}-in-canada-from-${c.slug}`).concat(["best-courses-to-study-in-canada-for-india-students"]),
  }));
  for (const c of SOURCE_COUNTRIES) {
    all.push(makeArticle({
      slug: `study-${f.slug}-in-canada-from-${c.slug}`,
      category: "field", categoryLabel: "Field guide", country: c.code,
      title: `Study ${f.name} in Canada from ${c.name} (2026)`,
      description: `${c.demonym} students' guide to ${f.name} in Canada — institutions, costs, English (${proofLocalShort(c)} for funds) and careers (${f.careers}).`,
      keywords: [`study ${f.name.toLowerCase()} in canada from ${c.name.toLowerCase()}`, `${f.name.toLowerCase()} canada ${c.demonym.toLowerCase()} students`],
      intro: `For ${c.demonym} students, ${f.name} pairs strong demand with a clean PGWP-to-PR route when you pick the programme carefully. ${f.note}`,
      blocks: [
        { kind: "h2", text: "Institutions to shortlist" },
        { kind: "ul", items: INSTITUTIONS.filter((i) => i.notable.some((n) => sameField(n, f.name))).slice(0, 8).map((i) => `${i.name} (${i.city}, ${i.province}) — ${i.tuition}/yr`) },
        { kind: "h2", text: "Money and English" },
        { kind: "ul", items: [`Funds: tuition + ${proof}.`, c.ieltsTypical] },
        { kind: "h2", text: "Careers and PR" },
        { kind: "p", text: `Roles include ${f.careers}. ${CANADA.pgwp.prPath}` },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: `Best ${f.name} colleges in Canada for ${c.demonym} students?`, a: `Shortlist by city, cost and PGWP-field eligibility — ${INSTITUTIONS.filter((i) => i.notable.some((n) => sameField(n, f.name))).slice(0, 3).map((i) => i.name).join(", ")} are common picks.` },
        { q: `What does ${f.name} cost?`, a: CANADA.tuitionRangeCad + "." },
      ],
      related: [`study-${f.slug}-in-canada`, `best-courses-to-study-in-canada-for-${c.slug}-students`, `pgwp-and-pr-after-studying-in-canada-${c.slug}`, `study-in-canada-from-${c.slug}`],
    }));
  }
}
function sameField(notable: string, fieldName: string): boolean {
  const a = notable.toLowerCase();
  const b = fieldName.toLowerCase();
  const key = b.split(/[ &]/)[0];
  return a.includes(key) || b.includes(a.split(/[ (]/)[0].toLowerCase());
}

// ── Category 5: city × country + city overview ─────────────────────────────
for (const ci of CITIES) {
  all.push(makeArticle({
    slug: `cost-of-living-in-${ci.slug}-for-students`,
    category: "city", categoryLabel: "City guide",
    title: `Cost of Living in ${ci.name} for International Students (2026)`,
    description: `A 2026 student budget for ${ci.name}, ${ci.province} — rent, food, transit (${ci.monthly}/month) and money-saving tips.`,
    keywords: [`cost of living in ${ci.name.toLowerCase()} students`, `${ci.name.toLowerCase()} student budget`, `living costs ${ci.name.toLowerCase()} canada`],
    intro: `${ci.name} runs about ${ci.monthly}/month for a student. ${ci.note}`,
    blocks: [
      { kind: "h2", text: "Monthly budget" },
      { kind: "table", head: ["Item", "Approx. (CAD/month)"], rows: [["Rent (shared)", "700–1,300"], ["Food", "300–450"], ["Transit", "100–160"], ["Phone/internet", "50–80"], ["Total", ci.monthly]] },
      { kind: "p", text: ci.note },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [
      { q: `Is ${ci.name} expensive for students?`, a: `Budget about ${ci.monthly}/month; sharing accommodation is the biggest saving.` },
    ],
    related: SOURCE_COUNTRIES.map((c) => `study-in-canada-from-${c.slug}`).concat(["cost-of-studying-in-canada-from-india"]),
  }));
  for (const c of SOURCE_COUNTRIES) {
    all.push(makeArticle({
      slug: `living-in-${ci.slug}-for-${c.slug}-students`,
      category: "city", categoryLabel: "City guide", country: c.code,
      title: `Living in ${ci.name} for ${c.demonym} Students (2026): Costs & Tips`,
      description: `What ${c.demonym} students spend in ${ci.name}, ${ci.province} (${ci.monthly}/month), plus community, jobs and housing tips for 2026.`,
      keywords: [`living in ${ci.name.toLowerCase()} ${c.demonym.toLowerCase()} students`, `${ci.name.toLowerCase()} cost ${c.name.toLowerCase()} students`],
      intro: `${ci.name} is a popular base for ${c.demonym} students — here's the real monthly budget (${ci.monthly}) and how to settle in fast.`,
      blocks: [
        { kind: "h2", text: "Monthly budget" },
        { kind: "table", head: ["Item", "Approx. (CAD/month)"], rows: [["Rent (shared)", "700–1,300"], ["Food", "300–450"], ["Transit", "100–160"], ["Total", ci.monthly]] },
        { kind: "p", text: `${ci.note} ${c.parentLangNote}` },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [
        { q: `How much do ${c.demonym} students spend in ${ci.name}?`, a: `About ${ci.monthly}/month, less with shared housing.` },
      ],
      related: [`cost-of-living-in-${ci.slug}-for-students`, `cost-of-studying-in-canada-from-${c.slug}`, `study-in-canada-from-${c.slug}`, `after-landing-in-canada-checklist-${c.slug}`],
    }));
  }
}

// ── Category 6: tests (general) + english-by-country ───────────────────────
const TEST_PAGES: Omit<Article, "updated">[] = [
  {
    slug: "duolingo-accepted-universities-in-canada", category: "tests", categoryLabel: "English test",
    title: "Duolingo Accepted Universities in Canada (2026): Scores & Truth",
    description: "Which Canadian universities accept the Duolingo English Test in 2026, the scores you need (110–125), and why IRCC still won't accept DET for your study permit.",
    keywords: ["duolingo accepted universities in canada", "duolingo score for canada", "duolingo vs ielts canada"],
    intro: "400+ Canadian institutions accept the Duolingo English Test for admission — it's cheap and fast. But there's a catch for your study permit. Here's the honest picture.",
    blocks: [
      { kind: "h2", text: "Scores and who accepts it" },
      { kind: "p", text: "Most undergraduate programmes want DET 110–120; master's often 120–125. Leading acceptors include U of T, UBC, McGill, Waterloo and Alberta." },
      { kind: "callout", text: "IRCC does NOT accept Duolingo for the study permit, and the PGWP needs IELTS General Training, CELPIP or PTE Core. Use DET for admission, then take an approved test." },
      testTable(),
    ],
    faqs: [
      { q: "Does IRCC accept Duolingo?", a: "No. Universities may admit you on DET, but the permit and PGWP need IELTS/PTE." },
      { q: "What DET score for Canada?", a: "Typically 110–120 (UG) and 120–125 (PG)." },
    ],
    related: ["ielts-vs-pte-vs-duolingo-for-canada", "moi-vs-ielts-for-canada", "study-in-canada-without-ielts-from-india"],
  },
  {
    slug: "ielts-vs-pte-vs-duolingo-for-canada", category: "tests", categoryLabel: "English test",
    title: "IELTS vs PTE vs Duolingo for Canada (2026): Which to Take",
    description: "A 2026 comparison of IELTS, PTE and Duolingo for Canadian study — which works for admission, the study permit and the PGWP.",
    keywords: ["ielts vs pte vs duolingo canada", "best english test for canada", "pte or ielts for canada"],
    intro: "Pick the wrong test and you pass admission but stall at the visa or PGWP. Here's which English test does which job for Canada.",
    blocks: [
      { kind: "h2", text: "Which test for which step" }, testTable(),
      { kind: "callout", text: CANADA.pgwp.testRule },
    ],
    faqs: [
      { q: "Which is easiest?", a: "Many find Duolingo and PTE quicker, but only IELTS/PTE work for the permit and PGWP." },
      { q: "Is PTE accepted for the PGWP?", a: "PTE Core is; PTE Academic is for admission." },
    ],
    related: ["duolingo-accepted-universities-in-canada", "moi-vs-ielts-for-canada", "study-in-canada-from-bangladesh"],
  },
  {
    slug: "moi-vs-ielts-for-canada", category: "tests", categoryLabel: "English test",
    title: "MOI vs IELTS for Canada (2026): When a Letter Is Enough",
    description: "Medium-of-Instruction letter vs IELTS for Canadian admission and visa in 2026 — when an MOI works and when it never will.",
    keywords: ["moi vs ielts canada", "medium of instruction canada", "moi accepted universities canada"],
    intro: "An MOI letter says your degree was taught in English. It is not a test — and that distinction decides whether it helps you.",
    blocks: [
      { kind: "h2", text: "What an MOI can and can't do" },
      { kind: "ul", items: ["Can: support admission at institutions that accept it", "Can't: replace IELTS/PTE for the study permit", "Can't: satisfy the PGWP language requirement"] },
      testTable(),
    ],
    faqs: [{ q: "Is MOI enough for a Canadian visa?", a: "No — the study permit and PGWP need a recognised test." }],
    related: ["study-in-canada-without-ielts-from-nepal", "ielts-vs-pte-vs-duolingo-for-canada", "duolingo-accepted-universities-in-canada"],
  },
  {
    slug: "clb-for-pgwp-canada", category: "tests", categoryLabel: "English test",
    title: "CLB for PGWP Canada (2026): Scores You Need to Stay & Work",
    description: "The PGWP language requirement explained for 2026 — CLB 7 for university grads, CLB 5 for college grads, with accepted tests.",
    keywords: ["clb for pgwp canada", "pgwp language requirement", "pgwp ielts score"],
    intro: "Since November 2024 every PGWP needs a language test. Miss the CLB by one band in one skill and the permit is refused — IRCC doesn't average.",
    blocks: [
      { kind: "p", text: CANADA.pgwp.languageRule }, { kind: "p", text: CANADA.pgwp.testRule },
      { kind: "callout", text: "Book IELTS General Training, CELPIP-General or PTE Core — not IELTS Academic — and meet the CLB in each skill separately." },
    ],
    faqs: [
      { q: "What CLB do I need for a PGWP?", a: CANADA.pgwp.languageRule },
      { q: "Which test counts?", a: CANADA.pgwp.testRule },
    ],
    related: ["pgwp-and-pr-after-studying-in-canada-india", "ielts-vs-pte-vs-duolingo-for-canada", "best-courses-to-study-in-canada-for-india-students"],
  },
];
for (const t of TEST_PAGES) all.push(makeArticle(t));
for (const c of SOURCE_COUNTRIES) {
  all.push(makeArticle({
    slug: `english-test-requirements-for-canada-${c.slug}`,
    category: "tests", categoryLabel: "English test", country: c.code,
    title: `English Test Requirements for Canada from ${c.name} (2026)`,
    description: `Which English test ${c.demonym} students need for Canadian admission, the study permit and the PGWP in 2026 — IELTS, PTE, TOEFL, Duolingo and MOI.`,
    keywords: [`english test for canada ${c.name.toLowerCase()}`, `ielts pte for canada ${c.demonym.toLowerCase()}`],
    intro: `${c.ieltsTypical} Here's which test to take at each step.`,
    blocks: [{ kind: "h2", text: "Test by step" }, testTable(), { kind: "callout", text: CANADA.pgwp.testRule }],
    faqs: [{ q: `What English score for Canada from ${c.name}?`, a: c.ieltsTypical }],
    related: [`ielts-requirements-for-canada-from-${c.slug}`, `study-in-canada-without-ielts-from-${c.slug}`, "ielts-vs-pte-vs-duolingo-for-canada"],
  }));
}

// ── Category 7: high-intent Q&A (LLM-SEO) ──────────────────────────────────
function qa(slug: string, q: string, a: string, country: CountryCode | undefined, related: string[], extra: Block[] = []): Article {
  return makeArticle({
    slug, category: "answers", categoryLabel: "Quick answer", country,
    title: q + " (2026)",
    description: a.slice(0, 155),
    keywords: [slug.replace(/-/g, " ")],
    intro: a,
    blocks: [{ kind: "h2", text: "The short answer" }, { kind: "p", text: a }, ...extra, { kind: "p", text: NO_GUARANTEE }],
    faqs: [{ q, a }],
    related,
  });
}
for (const c of SOURCE_COUNTRIES) {
  all.push(qa(`how-much-bank-balance-for-canada-student-visa-from-${c.slug}`, `How much bank balance is needed for a Canada student visa from ${c.name}?`, `You must show first-year tuition plus ${proof}. For ${c.name}, the living portion is about ${c.proofOfFundsLocal}. The funds must be consistent and have a clear source.`, c.code, [`proof-of-funds-canada-study-visa-${c.slug}`, `gic-canada-for-${c.slug}-students`, `cost-of-studying-in-canada-from-${c.slug}`], [feesTable()]));
  all.push(qa(`is-sds-still-available-for-${c.slug}-students-2026`, `Is SDS still available for ${c.demonym} students in 2026?`, CANADA.sds + ` ${c.demonym} students now apply through the regular stream (about ${CANADA.processingWeeks}).`, c.code, [`canada-student-visa-from-${c.slug}`, `canada-study-permit-processing-time-${c.slug}`, `study-in-canada-from-${c.slug}`]));
  all.push(qa(`can-${c.slug}-students-study-in-canada-without-ielts`, `Can ${c.demonym} students study in Canada without IELTS?`, `For admission, sometimes — via an MOI letter or the Duolingo English Test where accepted. But IRCC doesn't accept Duolingo, and the PGWP needs IELTS General Training, CELPIP or PTE Core, so plan a recognised test.`, c.code, [`study-in-canada-without-ielts-from-${c.slug}`, `ielts-requirements-for-canada-from-${c.slug}`, "duolingo-accepted-universities-in-canada"]));
  all.push(qa(`how-long-does-canada-student-visa-take-from-${c.slug}`, `How long does a Canada student visa take from ${c.name}?`, `About ${CANADA.processingWeeks}. Since SDS ended, all ${c.demonym} applications use the regular stream — apply at least three months before your start date.`, c.code, [`canada-study-permit-processing-time-${c.slug}`, `how-to-apply-for-canada-student-visa-from-${c.slug}`, `canada-intakes-2026-for-${c.slug}-students`]));
  all.push(qa(`do-i-need-a-pal-for-canada-from-${c.slug}`, `Do ${c.demonym} students need a PAL for Canada?`, CANADA.pal, c.code, [`canada-student-visa-from-${c.slug}`, `canada-study-visa-documents-checklist-${c.slug}`, `study-in-canada-from-${c.slug}`]));
}
const GENERAL_QA: [string, string, string, string[]][] = [
  ["is-sds-discontinued", "Is the Student Direct Stream (SDS) discontinued?", CANADA.sds, ["canada-student-visa-from-india", "is-sds-still-available-for-india-students-2026"]],
  ["how-much-is-the-gic-for-canada-2026", "How much is the GIC for Canada in 2026?", `The GIC matches the proof-of-funds threshold: CAD ${CANADA.proofOfFundsCad.toLocaleString()}, rising to CAD ${CANADA.proofOfFundsCadFromSep2026.toLocaleString()} for applications on or after 1 September 2026. It's released to you at roughly CAD ${CANADA.gicMonthlyReleaseCad}/month.`, ["gic-canada-for-india-students", "proof-of-funds-canada-study-visa-india"]],
  ["does-ircc-accept-duolingo", "Does IRCC accept the Duolingo English Test?", "No. Canadian institutions may admit you on Duolingo, but IRCC does not accept it for the study permit, and the PGWP needs IELTS General Training, CELPIP-General or PTE Core.", ["duolingo-accepted-universities-in-canada", "ielts-vs-pte-vs-duolingo-for-canada"]],
  ["can-i-work-while-studying-in-canada", "Can international students work while studying in Canada?", `Eligible study-permit holders can work up to ${CANADA.weeklyWorkHours} hours/week off-campus during the semester, and full-time during scheduled breaks.`, ["after-landing-in-canada-checklist-india", "pgwp-and-pr-after-studying-in-canada-india"]],
  ["which-canada-intake-is-best", "Which Canada intake is best — Fall, Winter or Spring?", "Fall (September) offers the most programmes and scholarships; Winter (January) has less competition; Spring (May) is a smaller backup. Apply early because of the PAL cap.", ["canada-intakes-2026-for-india-students", "canada-study-permit-processing-time-india"]],
  ["how-to-get-pr-after-study-in-canada", "How do I get PR after studying in Canada?", CANADA.pgwp.prPath, ["pgwp-and-pr-after-studying-in-canada-india", "best-courses-to-study-in-canada-for-india-students"]],
];
for (const [slug, q, a, related] of GENERAL_QA) all.push(qa(slug, q, a, undefined, related));

// ── Category 8: comparisons / best-of (general) ────────────────────────────
const LISTS: Omit<Article, "updated">[] = [
  {
    slug: "cheapest-universities-in-canada-for-international-students", category: "lists", categoryLabel: "Best-of list",
    title: "Cheapest Universities & Colleges in Canada (2026) for International Students",
    description: "Affordable Canadian DLIs in 2026 with honest tuition ranges and PGWP notes — for Bangladeshi, Indian and Nepali students.",
    keywords: ["cheapest universities in canada", "affordable colleges canada international students", "low tuition canada 2026"],
    intro: "Lower tuition in an affordable province can save lakhs over a degree. These public institutions are consistently among the more affordable — verify current fees officially.",
    blocks: [
      { kind: "h2", text: "Affordable institutions" },
      { kind: "table", head: ["Institution", "City", "Type", "Approx. tuition (CAD/yr)"], rows: INSTITUTIONS.filter(affordable).map((i) => [i.name, `${i.city}, ${i.province}`, i.type, i.tuition]) },
      { kind: "callout", text: "Always confirm fees and PGWP-field eligibility on the official site before applying." },
    ],
    faqs: [{ q: "Which Canadian province is cheapest to study in?", a: "Manitoba, Saskatchewan and Newfoundland generally have the lowest tuition and living costs." }],
    related: ["cost-of-studying-in-canada-from-india", "best-colleges-in-canada-for-pgwp", "study-in-canada-from-bangladesh"],
  },
  {
    slug: "best-colleges-in-canada-for-pgwp", category: "lists", categoryLabel: "Best-of list",
    title: "Best Colleges in Canada for PGWP (2026): How to Choose",
    description: "How to choose a Canadian public college whose diploma is PGWP-eligible in 2026 — field-of-study rule, language test and shortlist.",
    keywords: ["best colleges in canada for pgwp", "pgwp eligible colleges canada", "public college canada pgwp"],
    intro: "A college diploma only helps your PR plan if it's PGWP-eligible. Here's how to choose — and the public colleges students shortlist.",
    blocks: [
      { kind: "callout", text: CANADA.pgwp.fieldRule },
      { kind: "h2", text: "Public colleges students shortlist" },
      { kind: "ul", items: INSTITUTIONS.filter((i) => i.type === "college").slice(0, 12).map((i) => `${i.name} (${i.city}) — ${i.tuition}/yr`) },
      { kind: "p", text: "Confirm your specific programme appears in an IRCC-eligible field before relying on a PGWP." },
    ],
    faqs: [{ q: "Do all college diplomas qualify for a PGWP?", a: CANADA.pgwp.fieldRule }],
    related: ["pgwp-and-pr-after-studying-in-canada-india", "clb-for-pgwp-canada", "cheapest-universities-in-canada-for-international-students"],
  },
  {
    slug: "best-cities-in-canada-for-international-students", category: "lists", categoryLabel: "Best-of list",
    title: "Best Cities in Canada for International Students (2026)",
    description: "Canada's best student cities in 2026 by cost, jobs and PNP friendliness — Toronto, Vancouver, Winnipeg, Calgary and more.",
    keywords: ["best cities in canada for international students", "affordable student cities canada", "where to study in canada"],
    intro: "Your city shapes your rent, your job market and even your PR odds. Here's how Canada's top student cities compare in 2026.",
    blocks: [
      { kind: "table", head: ["City", "Province", "Monthly living (CAD)", "Note"], rows: CITIES.map((ci) => [ci.name, ci.province, ci.monthly, ci.note]) },
    ],
    faqs: [{ q: "What's the cheapest student city in Canada?", a: "Winnipeg, Saskatoon and St. John's are consistently among the most affordable." }],
    related: ["cost-of-living-in-toronto-for-students", "cost-of-studying-in-canada-from-nepal", "study-in-canada-from-india"],
  },
];
for (const l of LISTS) all.push(makeArticle(l));

// ── Category 9: careers after study (field × country + general) ────────────
for (const f of FIELDS) {
  all.push(makeArticle({
    slug: `${f.slug}-jobs-in-canada-after-study`,
    category: "careers", categoryLabel: "Careers & PR",
    title: `${f.name} Jobs in Canada After Study (2026): Roles, Pay & PR`,
    description: `Career outcomes after a ${f.name} programme in Canada — typical roles (${f.careers}), the PGWP language rule and the route to PR.`,
    keywords: [`${f.name.toLowerCase()} jobs in canada`, `${f.name.toLowerCase()} careers canada international students`, `${f.name.toLowerCase()} pgwp pr canada`],
    intro: `A ${f.name} programme only pays off if it leads to work and, ideally, PR. ${f.note} Here's the honest career picture in 2026.`,
    blocks: [
      { kind: "h2", text: "Typical roles" }, { kind: "p", text: `Graduates move into ${f.careers}.` },
      { kind: "h2", text: "PGWP and PR" }, { kind: "p", text: CANADA.pgwp.fieldRule }, { kind: "callout", text: CANADA.pgwp.prPath },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [
      { q: `Is ${f.name} good for PR in Canada?`, a: `When your job maps to TEER 0/1/2/3, ${f.name} aligns well with Express Entry/PNP. ${f.note}` },
      { q: `Do ${f.name} college diplomas qualify for a PGWP?`, a: CANADA.pgwp.fieldRule },
    ],
    related: [`study-${f.slug}-in-canada`, `best-colleges-in-canada-for-${f.slug}`, "pgwp-and-pr-after-studying-in-canada-india"],
  }));
  for (const c of SOURCE_COUNTRIES) {
    all.push(makeArticle({
      slug: `${f.slug}-jobs-in-canada-for-${c.slug}-graduates`,
      category: "careers", categoryLabel: "Careers & PR", country: c.code,
      title: `${f.name} Jobs in Canada for ${c.demonym} Graduates (2026)`,
      description: `What ${c.demonym} ${f.name} graduates can expect in Canada — roles (${f.careers}), the PGWP rules and the study-to-PR pathway.`,
      keywords: [`${f.name.toLowerCase()} jobs canada ${c.demonym.toLowerCase()}`, `${f.name.toLowerCase()} pr canada ${c.name.toLowerCase()}`],
      intro: `${c.demonym} ${f.name} graduates have one of the cleaner routes from study to PR — if the programme and job tier line up. ${f.note}`,
      blocks: [
        { kind: "h2", text: "Roles and demand" }, { kind: "p", text: `Common roles: ${f.careers}.` },
        { kind: "h2", text: "From PGWP to PR" }, { kind: "p", text: `${CANADA.pgwp.languageRule} ${CANADA.pgwp.prPath}` },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [{ q: `Can ${c.demonym} ${f.name} graduates get PR?`, a: CANADA.pgwp.prPath }],
      related: [`study-${f.slug}-in-canada-from-${c.slug}`, `pgwp-and-pr-after-studying-in-canada-${c.slug}`, `best-courses-to-study-in-canada-for-${c.slug}-students`],
    }));
  }
  all.push(makeArticle({
    slug: `best-colleges-in-canada-for-${f.slug}`,
    category: "lists", categoryLabel: "Best-of list",
    title: `Best Colleges & Universities in Canada for ${f.name} (2026)`,
    description: `Where to study ${f.name} in Canada — institutions students shortlist, costs and the PGWP field rule for 2026.`,
    keywords: [`best colleges in canada for ${f.name.toLowerCase()}`, `${f.name.toLowerCase()} universities canada`, `where to study ${f.name.toLowerCase()} canada`],
    intro: `Choosing the right institution for ${f.name} balances cost, city and PGWP eligibility. These DLIs are common, well-regarded picks — verify the exact programme officially.`,
    blocks: [
      { kind: "h2", text: "Institutions to shortlist" },
      { kind: "table", head: ["Institution", "City", "Type", "Tuition (CAD/yr)"], rows: INSTITUTIONS.filter((i) => i.notable.some((n) => sameField(n, f.name))).slice(0, 12).map((i) => [i.name, `${i.city}, ${i.province}`, i.type, i.tuition]) },
      { kind: "callout", text: CANADA.pgwp.fieldRule },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Which is the best college for ${f.name} in Canada?`, a: `It depends on cost, city and PGWP eligibility — shortlist 3–4 and compare. ${f.note}` }],
    related: [`study-${f.slug}-in-canada`, `${f.slug}-jobs-in-canada-after-study`, "cheapest-universities-in-canada-for-international-students"],
  }));
}

// ── Category 10: provinces (overview + by country + best unis) ─────────────
const PROVINCES = [
  { name: "Ontario", slug: "ontario", pnp: "OINP", note: "The largest study hub (Toronto, Ottawa, Waterloo) with the most colleges and universities and the biggest job market." },
  { name: "British Columbia", slug: "british-columbia", pnp: "BC PNP", note: "Vancouver and Victoria; strong tech and film, higher cost of living, scenic and mild." },
  { name: "Alberta", slug: "alberta", pnp: "Alberta Advantage (AAIP)", note: "Calgary and Edmonton; no provincial sales tax, energy and growing tech, affordable vs Toronto." },
  { name: "Manitoba", slug: "manitoba", pnp: "MPNP", note: "Winnipeg; among the most affordable provinces and one of the more student-friendly PNPs." },
  { name: "Saskatchewan", slug: "saskatchewan", pnp: "SINP", note: "Saskatoon and Regina; low cost of living and regular PNP draws." },
  { name: "Nova Scotia", slug: "nova-scotia", pnp: "NSNP / AIP", note: "Halifax and Sydney; Atlantic Canada with the AIP pathway and a welcoming newcomer culture." },
  { name: "Quebec", slug: "quebec", pnp: "Quebec selection (CAQ)", note: "Montreal; lower tuition but its own CAQ and selection rules — French helps a lot." },
  { name: "Newfoundland and Labrador", slug: "newfoundland", pnp: "NLPNP / AIP", note: "St. John's; among the most affordable tuition and a friendly Atlantic pathway." },
];
for (const p of PROVINCES) {
  const unis = INSTITUTIONS.filter((i) => i.province.toLowerCase().includes(p.name.toLowerCase().split(" ")[0]));
  all.push(makeArticle({
    slug: `study-in-${p.slug}-canada-international-students`,
    category: "province", categoryLabel: "Province guide",
    title: `Study in ${p.name}, Canada (2026): Universities, Costs & PNP`,
    description: `A 2026 guide to studying in ${p.name} — top institutions, costs, the ${p.pnp} pathway and why students choose it.`,
    keywords: [`study in ${p.name.toLowerCase()} canada`, `${p.name.toLowerCase()} universities international students`, `${p.pnp.toLowerCase()} student`],
    intro: `${p.note}`,
    blocks: [
      { kind: "h2", text: "Why students choose it" }, { kind: "p", text: `${p.note} PR-minded students watch the ${p.pnp} stream.` },
      ...(unis.length ? [{ kind: "h2" as const, text: "Institutions here" }, { kind: "ul" as const, items: unis.slice(0, 10).map((i) => `${i.name} (${i.city}) — ${i.tuition}/yr`) }] : []),
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Is ${p.name} good for international students?`, a: p.note }],
    related: SOURCE_COUNTRIES.map((c) => `study-in-${p.slug}-from-${c.slug}`).concat(["best-cities-in-canada-for-international-students"]),
  }));
  for (const c of SOURCE_COUNTRIES) {
    all.push(makeArticle({
      slug: `study-in-${p.slug}-from-${c.slug}`,
      category: "province", categoryLabel: "Province guide", country: c.code,
      title: `Study in ${p.name} from ${c.name} (2026): Guide for ${c.demonym} Students`,
      description: `${c.demonym} students' guide to ${p.name}, Canada — institutions, costs, the ${p.pnp} pathway and how to apply in 2026.`,
      keywords: [`study in ${p.name.toLowerCase()} from ${c.name.toLowerCase()}`, `${p.name.toLowerCase()} for ${c.demonym.toLowerCase()} students`],
      intro: `For ${c.demonym} students, ${p.name} offers ${p.note.toLowerCase()}`,
      blocks: [
        ...(unis.length ? [{ kind: "h2" as const, text: "Institutions to shortlist" }, { kind: "ul" as const, items: unis.slice(0, 8).map((i) => `${i.name} (${i.city}) — ${i.tuition}/yr`) }] : []),
        { kind: "h2", text: "Money and PR" }, { kind: "p", text: `Show tuition + ${proof}. PR-focused students track the ${p.pnp}.` },
        { kind: "p", text: NO_GUARANTEE },
      ],
      faqs: [{ q: `How do ${c.demonym} students apply to ${p.name}?`, a: `Get a Letter of Acceptance from a DLI in ${p.name}, arrange a PAL where required, fund your file, then apply for the study permit.` }],
      related: [`study-in-${p.slug}-canada-international-students`, `study-in-canada-from-${c.slug}`, `canada-student-visa-from-${c.slug}`],
    }));
  }
}

// ── Category 11: intake-by-season × country ────────────────────────────────
const SEASONS = [
  { slug: "fall-september", name: "Fall (September)", note: CANADA.intakes[0].note },
  { slug: "winter-january", name: "Winter (January)", note: CANADA.intakes[1].note },
  { slug: "spring-may", name: "Spring (May)", note: CANADA.intakes[2].note },
];
for (const s of SEASONS) for (const c of SOURCE_COUNTRIES) {
  all.push(makeArticle({
    slug: `canada-${s.slug}-intake-${c.slug}`,
    category: "planning", categoryLabel: "Planning", country: c.code,
    title: `Canada ${s.name} Intake for ${c.demonym} Students (2026): Deadlines`,
    description: `Everything ${c.demonym} students need for the Canada ${s.name} intake — when to apply, deadlines and how the PAL cap affects timing.`,
    keywords: [`canada ${s.name.toLowerCase()} intake ${c.demonym.toLowerCase()}`, `${s.slug.replace(/-/g, " ")} intake canada ${c.name.toLowerCase()}`],
    intro: `${s.note} Here's how ${c.demonym} students should plan it.`,
    blocks: [
      { kind: "p", text: s.note }, { kind: "callout", text: CANADA.cap },
      { kind: "h2", text: "Backwards timeline" }, { kind: "ol", items: ["Find each programme's deadline for this intake", `Leave ${CANADA.processingWeeks} for the study permit`, "Sit your English test 3–4 months earlier", "Arrange funds/GIC" + (c.specialDoc?.name === "No Objection Certificate (NOC)" ? " and the NOC" : "") + " before applying"] },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `When should ${c.demonym} students apply for the ${s.name} intake?`, a: `Work back from the start date by ${CANADA.processingWeeks} plus test and funding time — usually 6–9 months ahead.` }],
    related: [`canada-intakes-2026-for-${c.slug}-students`, `how-to-apply-for-canada-student-visa-from-${c.slug}`, `study-in-canada-from-${c.slug}`],
  }));
}

// ── Category 12: city part-time jobs + accommodation ───────────────────────
for (const ci of CITIES) {
  all.push(makeArticle({
    slug: `part-time-jobs-in-${ci.slug}-for-students`,
    category: "city", categoryLabel: "City guide",
    title: `Part-Time Jobs in ${ci.name} for International Students (2026)`,
    description: `How international students find part-time work in ${ci.name}, the ${CANADA.weeklyWorkHours}-hour rule, typical roles and pay in 2026.`,
    keywords: [`part time jobs in ${ci.name.toLowerCase()} for students`, `student jobs ${ci.name.toLowerCase()}`, `work while studying ${ci.name.toLowerCase()}`],
    intro: `Eligible students can work up to ${CANADA.weeklyWorkHours} hours/week off-campus. In ${ci.name}, the common roles are retail, hospitality, campus jobs and customer service.`,
    blocks: [
      { kind: "h2", text: "What you can earn" }, { kind: "p", text: `Most part-time roles pay around the provincial minimum wage; budget it as a top-up, not your tuition plan. ${ci.note}` },
      { kind: "h2", text: "Rules to respect" }, { kind: "ul", items: [`Up to ${CANADA.weeklyWorkHours} hours/week in session; full-time on scheduled breaks`, "Get a SIN first", "On-campus and co-op work have their own rules"] },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `How many hours can students work in ${ci.name}?`, a: `Up to ${CANADA.weeklyWorkHours} hours/week off-campus during the semester for eligible study-permit holders.` }],
    related: [`cost-of-living-in-${ci.slug}-for-students`, `student-accommodation-in-${ci.slug}`, "can-i-work-while-studying-in-canada"],
  }));
  all.push(makeArticle({
    slug: `student-accommodation-in-${ci.slug}`,
    category: "city", categoryLabel: "City guide",
    title: `Student Accommodation in ${ci.name} (2026): Costs & How to Find It`,
    description: `Where international students live in ${ci.name} — on-campus vs shared rentals, costs (${ci.monthly}/month all-in) and how to avoid rental scams.`,
    keywords: [`student accommodation in ${ci.name.toLowerCase()}`, `student housing ${ci.name.toLowerCase()}`, `rent in ${ci.name.toLowerCase()} students`],
    intro: `Housing is the biggest line in any student budget. In ${ci.name}, plan ${ci.monthly}/month all-in and start your search early. ${ci.note}`,
    blocks: [
      { kind: "h2", text: "Your options" }, { kind: "ul", items: ["On-campus residence — convenient, often pricier, limited spots", "Shared off-campus rental — the cheapest per person", "Homestay — full board, good for a first term"] },
      { kind: "callout", text: "Never pay a deposit before you've verified the listing and signed a proper lease — rental scams target new arrivals." },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `How much is student rent in ${ci.name}?`, a: `Shared rooms run roughly CAD 700–1,300/month; all-in living is about ${ci.monthly}.` }],
    related: [`cost-of-living-in-${ci.slug}-for-students`, `part-time-jobs-in-${ci.slug}-for-students`, "best-cities-in-canada-for-international-students"],
  }));
}

// ── Category 13: comparisons by country ────────────────────────────────────
const COMPARES = [
  { slug: "uk", name: "the UK", line: "The UK's one-year master's can finish faster and cheaper overall, but Canada's PGWP and PR runway is longer." },
  { slug: "australia", name: "Australia", line: "Australia offers strong work rights and lifestyle; Canada generally edges it on the study-to-PR pipeline and (often) cost." },
  { slug: "usa", name: "the USA", line: "The USA has elite universities and high salaries, but a tougher visa/stay path; Canada is more predictable for PR." },
];
for (const cmp of COMPARES) for (const c of SOURCE_COUNTRIES) {
  all.push(makeArticle({
    slug: `canada-vs-${cmp.slug}-for-${c.slug}-students`,
    category: "compare", categoryLabel: "Comparison", country: c.code,
    title: `Canada vs ${cmp.name} for ${c.demonym} Students (2026)`,
    description: `An honest 2026 comparison of Canada and ${cmp.name} for ${c.demonym} students — cost, post-study work, PR and visa difficulty.`,
    keywords: [`canada vs ${cmp.slug} for ${c.demonym.toLowerCase()} students`, `canada or ${cmp.slug} ${c.name.toLowerCase()}`],
    intro: `Deciding between Canada and ${cmp.name}? ${cmp.line} Here's the breakdown for ${c.demonym} students.`,
    blocks: [
      { kind: "p", text: cmp.line },
      { kind: "h2", text: "What matters for you" }, { kind: "ul", items: ["Total cost (tuition + living + travel)", "Post-study work length and job market", "PR pathway and how realistic it is", "Visa difficulty and processing time"] },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Is Canada better than ${cmp.name} for ${c.demonym} students?`, a: `${cmp.line} The right pick depends on your budget and whether PR is your goal.` }],
    related: [`canada-vs-uk-vs-australia-for-${c.slug}-students`, `study-in-canada-from-${c.slug}`, `pgwp-and-pr-after-studying-in-canada-${c.slug}`],
  }));
}

// ── Category 14: university entrance scholarships (universities only) ───────
for (const inst of INSTITUTIONS.filter((i) => i.type === "university")) {
  all.push(makeArticle({
    slug: `scholarships-at-${inst.slug}`,
    category: "scholarships", categoryLabel: "Scholarships",
    title: `Scholarships at ${inst.name} (2026): Entrance Awards for International Students`,
    description: `Scholarship options for international students at ${inst.name} (${inst.city}) in 2026 — entrance awards, how they help your visa, and how to apply.`,
    keywords: [`${inst.name.toLowerCase()} scholarships international students`, `${inst.name.toLowerCase()} entrance scholarship`, `scholarships at ${inst.slug.replace(/-/g, " ")}`],
    intro: `${inst.name} in ${inst.city} offers entrance and merit scholarships to strong international applicants. Always read your offer letter — many awards are automatic.`,
    blocks: [
      { kind: "h2", text: "How to win one" }, { kind: "ul", items: ["Apply early with a strong academic record", "Check the admissions page for named entrance awards", "Look for the scholarship line in your offer letter", "Pair it with a GIC/loan to complete your proof of funds"] },
      { kind: "callout", text: "A scholarship letter is accepted proof of funds and reduces the amount you must otherwise show." },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Does ${inst.name} offer scholarships to international students?`, a: `Yes — entrance and merit awards are common; amounts and names are on the official admissions page and your offer letter.` }],
    related: [`${inst.slug}-international-students`, "scholarships-in-canada-for-india-students", `study-at-${inst.slug}-from-india`],
  }));
}

// ── Category 15: after-12th / after-graduation + family routes ─────────────
for (const c of SOURCE_COUNTRIES) {
  all.push(makeArticle({
    slug: `study-in-canada-after-12th-from-${c.slug}`,
    category: "planning", categoryLabel: "Planning", country: c.code,
    title: `Study in Canada After 12th from ${c.name} (2026): Options & Steps`,
    description: `What ${c.demonym} students can do after 12th / +2 to study in Canada in 2026 — diplomas vs bachelor's, costs, English and the visa.`,
    keywords: [`study in canada after 12th from ${c.name.toLowerCase()}`, `canada after 12th ${c.demonym.toLowerCase()}`, `bachelors in canada after 12th ${c.name.toLowerCase()}`],
    intro: `After 12th (or +2), ${c.demonym} students can pick a public-college diploma or a bachelor's degree. Each has different cost, length and PGWP implications.`,
    blocks: [
      { kind: "h2", text: "Diploma vs bachelor's" }, { kind: "table", head: ["Path", "Length", "Cost", "PGWP note"], rows: [["Public college diploma", "1–3 yrs", "CAD 14k–24k/yr", "Needs an IRCC-eligible field"], ["Bachelor's degree", "3–4 yrs", "CAD 20k–60k/yr", "Degree → no field-of-study list"]] },
      { kind: "p", text: `Show tuition + ${proof}.` },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Can ${c.demonym} students study in Canada right after 12th?`, a: "Yes — with a recognised secondary certificate, the required English score, funds and a DLI offer." }],
    related: [`study-in-canada-from-${c.slug}`, `best-courses-to-study-in-canada-for-${c.slug}-students`, `cost-of-studying-in-canada-from-${c.slug}`],
  }));
  all.push(makeArticle({
    slug: `study-in-canada-after-graduation-from-${c.slug}`,
    category: "planning", categoryLabel: "Planning", country: c.code,
    title: `Study in Canada After Graduation from ${c.name} (2026): Master's & PG Diplomas`,
    description: `${c.demonym} graduates' options in Canada — master's vs post-graduate diplomas, costs, the PAL exemption for public-DLI master's, and PR.`,
    keywords: [`study in canada after graduation from ${c.name.toLowerCase()}`, `masters in canada ${c.demonym.toLowerCase()}`, `pg diploma canada ${c.name.toLowerCase()}`],
    intro: `After a bachelor's, ${c.demonym} students usually choose a master's or a post-graduate diploma. There's a key 2026 perk for public-DLI master's students.`,
    blocks: [
      { kind: "callout", text: "Students starting a master's or doctoral degree at a public DLI are exempt from the PAL requirement from 1 January 2026." },
      { kind: "h2", text: "Master's vs PG diploma" }, { kind: "table", head: ["Path", "Length", "PGWP"], rows: [["Master's (public university)", "1–2 yrs", "Degree → PGWP-eligible (language test applies)"], ["PG diploma (public college)", "1–2 yrs", "Needs an IRCC-eligible field"]] },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Do master's students from ${c.name} need a PAL?`, a: "Not at a public DLI from 1 January 2026 — they're exempt." }],
    related: [`pgwp-and-pr-after-studying-in-canada-${c.slug}`, `study-in-canada-from-${c.slug}`, `scholarships-in-canada-for-${c.slug}-students`],
  }));
  all.push(makeArticle({
    slug: `bring-spouse-to-canada-on-study-permit-${c.slug}`,
    category: "planning", categoryLabel: "Planning", country: c.code,
    title: `Bringing Your Spouse to Canada on a Study Permit from ${c.name} (2026)`,
    description: `Can ${c.demonym} students bring a spouse to Canada in 2026? The current spousal open work permit rules and who still qualifies.`,
    keywords: [`bring spouse to canada study permit ${c.demonym.toLowerCase()}`, `spouse open work permit canada ${c.name.toLowerCase()}`, `dependent visa canada student ${c.name.toLowerCase()}`],
    intro: `Spousal open work permit (SOWP) rules tightened recently. For ${c.demonym} students, eligibility now depends on your programme and level.`,
    blocks: [
      { kind: "callout", text: "Spousal open work permits are now limited to spouses of students in specific graduate and professional programmes. Confirm current IRCC eligibility for your exact programme before planning." },
      { kind: "p", text: "Where SOWP isn't available, a spouse may still apply for a visitor visa or their own study/work permit on their own merits." },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Can ${c.demonym} students bring a spouse to Canada?`, a: "Sometimes — spousal open work permits are restricted to certain graduate/professional programmes; check current IRCC rules for your programme." }],
    related: [`study-in-canada-from-${c.slug}`, `pgwp-and-pr-after-studying-in-canada-${c.slug}`, `canada-student-visa-from-${c.slug}`],
  }));
}

// ── Category 16: more high-intent Q&A (LLM-SEO) ────────────────────────────
for (const c of SOURCE_COUNTRIES) {
  all.push(qa(`how-much-does-it-cost-to-study-in-canada-from-${c.slug}`, `How much does it cost to study in Canada from ${c.name}?`, `Budget roughly CAD 30,000–55,000 for year one (tuition + living + GIC). You must prove tuition plus ${proof}; for ${c.name} the living portion is about ${c.proofOfFundsLocal}.`, c.code, [`cost-of-studying-in-canada-from-${c.slug}`, `cheapest-universities-in-canada-for-${c.slug}-students`, `gic-canada-for-${c.slug}-students`], [feesTable()]));
  all.push(qa(`what-ielts-score-for-canada-from-${c.slug}`, `What IELTS score do I need for Canada from ${c.name}?`, c.ieltsTypical + " For the PGWP later, use IELTS General Training (not Academic).", c.code, [`ielts-requirements-for-canada-from-${c.slug}`, `english-test-requirements-for-canada-${c.slug}`, "ielts-vs-pte-vs-duolingo-for-canada"]));
  all.push(qa(`best-time-to-apply-for-canada-student-visa-from-${c.slug}`, `When is the best time to apply for a Canada student visa from ${c.name}?`, `Apply 6–9 months before your start date. Leave ${CANADA.processingWeeks} for the study permit plus time for the English test and funding, and apply early because of the PAL cap.`, c.code, [`canada-intakes-2026-for-${c.slug}-students`, `canada-study-permit-processing-time-${c.slug}`, `how-to-apply-for-canada-student-visa-from-${c.slug}`]));
  all.push(qa(`can-i-get-pr-in-canada-after-study-from-${c.slug}`, `Can ${c.demonym} students get PR in Canada after study?`, CANADA.pgwp.prPath + " Choose a PGWP-eligible programme and aim for TEER 0/1/2/3 work.", c.code, [`pgwp-and-pr-after-studying-in-canada-${c.slug}`, `best-courses-to-study-in-canada-for-${c.slug}-students`, `study-in-canada-from-${c.slug}`]));
}
const MORE_GENERAL_QA: [string, string, string, string[]][] = [
  ["what-is-a-pal-canada", "What is a PAL (Provincial Attestation Letter) for Canada?", CANADA.pal + " You usually need to accept your offer and pay tuition to get one.", ["do-i-need-a-pal-for-canada-from-india", "canada-student-visa-from-india"]],
  ["how-many-study-permits-does-canada-issue", "How many study permits does Canada issue (the cap)?", CANADA.cap, ["canada-intakes-2026-for-india-students", "which-canada-intake-is-best"]],
  ["is-canada-good-for-international-students-2026", "Is Canada still good for international students in 2026?", "Yes — despite the permit cap, tighter PGWP rules and higher proof of funds, Canada remains a top choice for its post-study work and study-to-PR pathway. The key is choosing a PGWP-eligible programme and budgeting honestly.", ["study-in-canada-from-bangladesh", "pgwp-and-pr-after-studying-in-canada-india"]],
  ["do-i-need-a-medical-exam-for-canada-study-permit", "Do I need a medical exam for a Canada study permit?", "Yes — most applicants complete an upfront medical with an IRCC panel physician before or with the application. Doing it early avoids weeks of delay.", ["canada-student-visa-from-nepal", "how-to-apply-for-canada-student-visa-from-india"]],
  ["how-much-gap-is-acceptable-for-canada-study-visa", "How much study gap is acceptable for a Canada study visa?", "There's no fixed limit, but any gap (work, family, exams) should be explained clearly in your SOP with documents. Unexplained gaps raise doubt about genuine intent.", ["sop-for-canada-student-visa-from-india", "canada-student-visa-refusal-reasons-india"]],
];
for (const [slug, q, a, related] of MORE_GENERAL_QA) all.push(qa(slug, q, a, undefined, related));

// ── Category 17: best universities in each province ────────────────────────
for (const p of PROVINCES) {
  const unis = INSTITUTIONS.filter((i) => i.province.toLowerCase().includes(p.name.toLowerCase().split(" ")[0]));
  if (!unis.length) continue;
  all.push(makeArticle({
    slug: `best-universities-in-${p.slug}-for-international-students`,
    category: "lists", categoryLabel: "Best-of list",
    title: `Best Universities & Colleges in ${p.name} for International Students (2026)`,
    description: `Top DLIs in ${p.name}, Canada for international students in 2026 — costs, cities and the ${p.pnp} pathway.`,
    keywords: [`best universities in ${p.name.toLowerCase()}`, `colleges in ${p.name.toLowerCase()} international students`, `study in ${p.name.toLowerCase()} canada`],
    intro: `${p.note} Here are institutions students shortlist in ${p.name} — verify fees and PGWP eligibility officially.`,
    blocks: [
      { kind: "table", head: ["Institution", "City", "Type", "Tuition (CAD/yr)"], rows: unis.map((i) => [i.name, i.city, i.type, i.tuition]) },
      { kind: "callout", text: `PR-focused students track the ${p.pnp} stream for graduates.` },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Which is the best university in ${p.name}?`, a: `It depends on your field, budget and city — shortlist a few from the list and compare programmes and costs.` }],
    related: [`study-in-${p.slug}-canada-international-students`, "best-cities-in-canada-for-international-students", "cheapest-universities-in-canada-for-international-students"],
  }));
}

// ── Category 18: per-country decision guides ───────────────────────────────
for (const c of SOURCE_COUNTRIES) {
  all.push(makeArticle({
    slug: `diploma-vs-degree-in-canada-for-${c.slug}-students`,
    category: "planning", categoryLabel: "Planning", country: c.code,
    title: `Diploma vs Degree in Canada for ${c.demonym} Students (2026)`,
    description: `Should ${c.demonym} students pick a college diploma or a university degree in Canada? Cost, length, PGWP and PR compared for 2026.`,
    keywords: [`diploma vs degree canada ${c.demonym.toLowerCase()}`, `college or university canada ${c.name.toLowerCase()}`],
    intro: `The diploma-vs-degree choice shapes your cost, your PGWP and your PR odds. Here's the honest trade-off for ${c.demonym} students.`,
    blocks: [
      { kind: "table", head: ["Factor", "Public college diploma", "University degree"], rows: [["Cost/yr", "CAD 14k–24k", "CAD 20k–60k"], ["Length", "1–3 yrs", "3–4 yrs (UG) / 1–2 (PG)"], ["PGWP", "Needs an eligible field", "No field list (language test applies)"], ["Best for", "Faster, work-focused", "Depth, research, brand"]] },
      { kind: "callout", text: CANADA.pgwp.fieldRule },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Is a diploma or degree better for PR in Canada?`, a: "Both can lead to PR. A degree keeps PGWP open without a field list; a diploma is cheaper and faster but must be in an IRCC-eligible field." }],
    related: [`study-in-canada-after-12th-from-${c.slug}`, `pgwp-and-pr-after-studying-in-canada-${c.slug}`, `best-courses-to-study-in-canada-for-${c.slug}-students`],
  }));
  all.push(makeArticle({
    slug: `co-op-programs-in-canada-for-${c.slug}-students`,
    category: "planning", categoryLabel: "Planning", country: c.code,
    title: `Co-op Programs in Canada for ${c.demonym} Students (2026)`,
    description: `How co-op (paid work placements) works for ${c.demonym} students in Canada — benefits, the co-op work permit and which institutions are known for it.`,
    keywords: [`co-op programs in canada ${c.demonym.toLowerCase()}`, `coop canada international students ${c.name.toLowerCase()}`],
    intro: `Co-op turns study into paid Canadian work experience — gold for both your résumé and PR. Here's how it works for ${c.demonym} students.`,
    blocks: [
      { kind: "h2", text: "Why co-op matters" }, { kind: "ul", items: ["Paid placements build Canadian experience employers value", "It strengthens your later PR profile", "You'll need a co-op work permit alongside your study permit"] },
      { kind: "p", text: "Waterloo, and many Ontario/BC colleges and universities, are known for strong co-op." },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Can ${c.demonym} students do co-op in Canada?`, a: "Yes, in co-op programmes — you apply for a co-op work permit with your study permit." }],
    related: [`best-courses-to-study-in-canada-for-${c.slug}-students`, `study-in-canada-from-${c.slug}`, "pgwp-and-pr-after-studying-in-canada-india"],
  }));
  all.push(makeArticle({
    slug: `biometrics-for-canada-study-permit-${c.slug}`,
    category: "visa", categoryLabel: "Visa guide", country: c.code,
    title: `Biometrics for a Canada Study Permit from ${c.name} (2026)`,
    description: `How and where ${c.demonym} students give biometrics for a Canada study permit — the fee (CAD ${CANADA.biometricsFeeCad}), the centre and timing.`,
    keywords: [`biometrics for canada study permit ${c.name.toLowerCase()}`, `vfs biometrics canada ${c.demonym.toLowerCase()}`],
    intro: `After you submit your application, IRCC asks for biometrics. ${c.demonym} students give them at ${c.visaCentre}.`,
    blocks: [
      { kind: "h2", text: "How it works" }, { kind: "ol", items: ["Submit your application and pay the biometrics fee (CAD " + CANADA.biometricsFeeCad + ")", "Get the Biometrics Instruction Letter (BIL)", `Book and attend ${c.visaCentre}`, "Biometrics are valid for 10 years"] },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Where do ${c.demonym} students give biometrics?`, a: `At ${c.visaCentre}, after receiving the Biometrics Instruction Letter.` }],
    related: [`how-to-apply-for-canada-student-visa-from-${c.slug}`, `canada-student-visa-from-${c.slug}`, `canada-study-permit-processing-time-${c.slug}`],
  }));
  all.push(qa(`what-is-the-canada-student-visa-success-rate-from-${c.slug}`, `What is the Canada student visa success rate from ${c.name}?`, `Approval rates vary by year, programme and the strength of your file — there's no guaranteed number. The controllable factors are clear, explainable funds, a genuine study plan and a complete application. ${c.demonym} applicants who fix the common refusal triggers (funds source, SOP, ties) significantly improve their odds.`, c.code, [`canada-student-visa-refusal-reasons-${c.slug}`, `proof-of-funds-canada-study-visa-${c.slug}`, `sop-for-canada-student-visa-from-${c.slug}`]));
  all.push(qa(`gic-vs-education-loan-for-canada-from-${c.slug}`, `GIC vs education loan for Canada from ${c.name}: which is better?`, `They solve different problems. A GIC is your own money used as the cleanest proof of living funds; an education loan finances tuition and can also fund the GIC. Most ${c.demonym} students use both: a loan to pay tuition + buy the GIC, and the GIC certificate as proof of funds.`, c.code, [`gic-canada-for-${c.slug}-students`, `education-loan-for-canada-from-${c.slug}`, `proof-of-funds-canada-study-visa-${c.slug}`]));
}

// ── Category 19: general explainers ────────────────────────────────────────
const EXPLAINERS: [string, string, string, string[]][] = [
  ["what-is-a-dli-in-canada", "What is a DLI (Designated Learning Institution) in Canada?", "A DLI is a school approved by a province/territory to host international students. You can only get a study permit with a Letter of Acceptance from a DLI, and only certain DLIs/programmes support a PGWP — always check the DLI number and PGWP eligibility before you pay.", ["study-in-canada-from-india", "best-colleges-in-canada-for-pgwp"]],
  ["canada-student-visa-interview-questions", "Common Canada Student Visa Interview / SOP Questions (2026)", "Most study-permit files are assessed on documents, not a formal interview, but officers (and your SOP) probe the same things: why this course and institution, why Canada, how you'll fund it, and your plan after graduation. Answer each honestly and specifically, tied to your background.", ["sop-for-canada-student-visa-from-india", "canada-student-visa-refusal-reasons-india"]],
  ["open-work-permit-vs-pgwp", "Open Work Permit vs PGWP: What's the Difference?", "A PGWP is a one-time open work permit you earn by graduating from an eligible Canadian programme (with the language test). A spousal open work permit is for certain students' spouses. Both let you work for any employer, but they have different eligibility and durations.", ["pgwp-and-pr-after-studying-in-canada-india", "clb-for-pgwp-canada"]],
  ["how-to-extend-a-canada-study-permit", "How to Extend a Canada Study Permit (2026)", "Apply to extend online before your current permit expires (ideally 30+ days ahead). You'll show continued enrolment, funds and a valid passport. If you applied before expiry you usually keep studying under maintained status while you wait.", ["study-in-canada-from-bangladesh", "after-landing-in-canada-checklist-india"]],
  ["proof-of-funds-canada-2026-explained", "Proof of Funds for Canada 2026 Explained (Amounts & Rules)", `IRCC requires first-year tuition plus living funds: CAD ${CANADA.proofOfFundsCad.toLocaleString()}, rising to CAD ${CANADA.proofOfFundsCadFromSep2026.toLocaleString()} for applications on or after 1 September 2026 (outside Quebec). A GIC, loan sanction, or consistent savings with a clear source all qualify.`, ["proof-of-funds-canada-study-visa-india", "how-much-is-the-gic-for-canada-2026"]],
];
for (const [slug, q, a, related] of EXPLAINERS) all.push(qa(slug, q, a, undefined, related));

// ── Category 20: top fields × country college shortlists ───────────────────
for (const f of FIELDS.slice(0, 6)) for (const c of SOURCE_COUNTRIES) {
  const picks = INSTITUTIONS.filter((i) => i.notable.some((n) => sameField(n, f.name)));
  all.push(makeArticle({
    slug: `best-colleges-in-canada-for-${f.slug}-for-${c.slug}-students`,
    category: "lists", categoryLabel: "Best-of list", country: c.code,
    title: `Best Colleges in Canada for ${f.name} for ${c.demonym} Students (2026)`,
    description: `Where ${c.demonym} students study ${f.name} in Canada — institutions, costs and PGWP-field notes for 2026.`,
    keywords: [`best colleges in canada for ${f.name.toLowerCase()} ${c.demonym.toLowerCase()}`, `${f.name.toLowerCase()} canada ${c.name.toLowerCase()} students`],
    intro: `For ${c.demonym} students, the best ${f.name} pick balances cost, city and a PGWP-eligible field. These institutions are common, solid choices.`,
    blocks: [
      { kind: "table", head: ["Institution", "City", "Type", "Tuition (CAD/yr)"], rows: picks.slice(0, 10).map((i) => [i.name, `${i.city}, ${i.province}`, i.type, i.tuition]) },
      { kind: "callout", text: CANADA.pgwp.fieldRule },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Which college is best for ${f.name} for ${c.demonym} students?`, a: `Shortlist by cost, city and PGWP eligibility — ${picks.slice(0, 3).map((i) => i.name).join(", ")} are common picks.` }],
    related: [`study-${f.slug}-in-canada-from-${c.slug}`, `${f.slug}-jobs-in-canada-for-${c.slug}-graduates`, `study-in-canada-from-${c.slug}`],
  }));
}

// ── Category 21: IELTS-band / low-score routes ─────────────────────────────
all.push(makeArticle({
  slug: "ielts-5-5-band-colleges-in-canada",
  category: "tests", categoryLabel: "English test",
  title: "IELTS 5.5 Band Colleges in Canada (2026): Real List & Visa Truth",
  description: `Canadian colleges that accept IELTS 5.5 in 2026 (${EXTRA.ielts55Colleges.slice(0, 4).join(", ")} and more), plus what the study permit really needs.`,
  keywords: ["ielts 5.5 band colleges in canada", "low ielts colleges canada", "canada colleges ielts 5.5"],
  intro: `A 5.5 doesn't close the door — several colleges admit diploma and pathway students at IELTS 5.5. But the study permit has its own bar. ${EXTRA.ielts55Note}`,
  blocks: [
    { kind: "h2", text: "Colleges that accept IELTS 5.5" },
    { kind: "ul", items: EXTRA.ielts55Colleges.map((n) => `${n} — diploma/pathway entry at around IELTS 5.5 (confirm per programme)`) },
    { kind: "callout", text: EXTRA.ielts55Note },
    { kind: "h2", text: "Test options" }, testTable(),
    { kind: "p", text: NO_GUARANTEE },
  ],
  faqs: [
    { q: "Can I study in Canada with IELTS 5.5?", a: "Yes, for some diploma and pathway programmes; for the study permit aim for 6.0 overall with 5.5 per band on UG/diploma routes." },
    { q: "Which colleges accept 5.5 bands?", a: EXTRA.ielts55Colleges.join(", ") + " (verify per programme)." },
  ],
  related: ["study-in-canada-without-ielts-from-india", "ielts-vs-pte-vs-duolingo-for-canada", "duolingo-accepted-universities-in-canada"],
}));
for (const c of SOURCE_COUNTRIES) {
  all.push(makeArticle({
    slug: `ielts-5-5-band-colleges-in-canada-for-${c.slug}-students`,
    category: "tests", categoryLabel: "English test", country: c.code,
    title: `IELTS 5.5 Band Colleges in Canada for ${c.demonym} Students (2026)`,
    description: `Where ${c.demonym} students with IELTS 5.5 can study in Canada — real colleges, pathway options and the study-permit reality for 2026.`,
    keywords: [`ielts 5.5 colleges canada ${c.demonym.toLowerCase()}`, `low ielts canada ${c.name.toLowerCase()}`],
    intro: `If you scored 5.5, ${c.demonym} students still have routes — diploma and pathway entry at select colleges. ${EXTRA.ielts55Note}`,
    blocks: [
      { kind: "ul", items: EXTRA.ielts55Colleges.map((n) => `${n} (verify per programme)`) },
      { kind: "callout", text: EXTRA.ielts55Note },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Can ${c.demonym} students study in Canada with IELTS 5.5?`, a: "Yes for some diploma/pathway programmes; the study permit still expects roughly 6.0 overall / 5.5 per band on UG routes." }],
    related: [`study-in-canada-without-ielts-from-${c.slug}`, `ielts-requirements-for-canada-from-${c.slug}`, "ielts-5-5-band-colleges-in-canada"],
  }));
}

// ── Category 22: 1-year master's / PG diploma / PR-friendly ─────────────────
for (const c of SOURCE_COUNTRIES) {
  all.push(makeArticle({
    slug: `1-year-masters-in-canada-for-${c.slug}-students`,
    category: "planning", categoryLabel: "Planning", country: c.code,
    title: `1-Year Master's in Canada for ${c.demonym} Students (2026): PR Fast-Track`,
    description: `Why a 1-year master's is the 2026 PR play for ${c.demonym} students — 3-year PGWP, PAL & cap exemption, and 135 CRS points.`,
    keywords: [`1 year masters in canada ${c.demonym.toLowerCase()}`, `one year master canada ${c.name.toLowerCase()}`, `masters in canada pr ${c.demonym.toLowerCase()}`],
    intro: `For ${c.demonym} students aiming at PR, a 1-year master's is the standout 2026 route. ${EXTRA.oneYearMaster}`,
    blocks: [
      { kind: "callout", text: EXTRA.oneYearMaster },
      { kind: "h2", text: "Why it works" }, { kind: "ul", items: ["3-year PGWP even for a sub-2-year programme", "Public-DLI master's: no PAL, exempt from the study-permit cap", "+135 CRS points toward Express Entry", "Lower total cost than a 2-year route"] },
      { kind: "p", text: `Show tuition + ${proof}.` },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [
      { q: `Can ${c.demonym} students get PR after a 1-year master's?`, a: `${CANADA.pgwp.prPath} A master's adds 135 CRS points and a 3-year PGWP.` },
      { q: "Do master's students need a PAL?", a: "Not at a public DLI from 1 January 2026 — they're PAL- and cap-exempt." },
    ],
    related: [`study-in-canada-after-graduation-from-${c.slug}`, `pgwp-and-pr-after-studying-in-canada-${c.slug}`, `pr-friendly-courses-in-canada-for-${c.slug}-students`],
  }));
  all.push(makeArticle({
    slug: `pg-diploma-courses-in-canada-for-${c.slug}-students`,
    category: "planning", categoryLabel: "Planning", country: c.code,
    title: `PG Diploma Courses in Canada for ${c.demonym} Students (2026)`,
    description: `Post-graduate diploma options in Canada for ${c.demonym} students — cost, the 1+1 PGWP stacking strategy and the PR angle for 2026.`,
    keywords: [`pg diploma in canada ${c.demonym.toLowerCase()}`, `post graduate diploma canada ${c.name.toLowerCase()}`, `1 year diploma canada ${c.demonym.toLowerCase()}`],
    intro: `PG diplomas are a cheaper, faster, job-focused route for ${c.demonym} graduates. ${EXTRA.pgDiploma}`,
    blocks: [
      { kind: "callout", text: EXTRA.pgDiploma },
      { kind: "callout", text: CANADA.pgwp.fieldRule },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [
      { q: "How long is the PGWP for a 1-year diploma?", a: "Usually 1 year. Some students stack two 1-year diplomas (1+1) to reach a 3-year PGWP when both qualify." },
      { q: "Do PG diplomas qualify for a PGWP?", a: CANADA.pgwp.fieldRule },
    ],
    related: [`diploma-vs-degree-in-canada-for-${c.slug}-students`, `1-year-masters-in-canada-for-${c.slug}-students`, `best-courses-to-study-in-canada-for-${c.slug}-students`],
  }));
  all.push(makeArticle({
    slug: `pr-friendly-courses-in-canada-for-${c.slug}-students`,
    category: "lists", categoryLabel: "Best-of list", country: c.code,
    title: `PR-Friendly Courses in Canada for ${c.demonym} Students (2026)`,
    description: `Courses that align best with Canadian PR for ${c.demonym} students in 2026 — ${EXTRA.prFields.slice(0, 3).join(", ")} and more.`,
    keywords: [`pr friendly courses in canada ${c.demonym.toLowerCase()}`, `best courses for pr canada ${c.name.toLowerCase()}`, `in demand courses canada pr ${c.demonym.toLowerCase()}`],
    intro: `Not every course leads to PR. For ${c.demonym} students, these fields map cleanly to TEER 0/1/2/3 jobs and Express Entry/PNP.`,
    blocks: [
      { kind: "h2", text: "Fields that align with PR" }, { kind: "ul", items: EXTRA.prFields.map((f) => `${f} — strong TEER 1/2 demand`) },
      { kind: "callout", text: CANADA.pgwp.prPath },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Which course is best for PR in Canada for ${c.demonym} students?`, a: `Fields mapping to TEER 0/1/2/3 — ${EXTRA.prFields.slice(0, 3).join(", ")} — align best, paired with a PGWP-eligible programme.` }],
    related: [`best-courses-to-study-in-canada-for-${c.slug}-students`, `pgwp-and-pr-after-studying-in-canada-${c.slug}`, `1-year-masters-in-canada-for-${c.slug}-students`],
  }));
  all.push(makeArticle({
    slug: `study-in-canada-without-gic-from-${c.slug}`,
    category: "funds", categoryLabel: "Funds guide", country: c.code,
    title: `Study in Canada Without GIC from ${c.name} (2026): Is It Possible?`,
    description: `Can ${c.demonym} students apply for a Canada study permit without a GIC in 2026? The real alternatives and the trade-offs.`,
    keywords: [`study in canada without gic ${c.demonym.toLowerCase()}`, `canada study permit without gic ${c.name.toLowerCase()}`, `proof of funds without gic canada`],
    intro: `${EXTRA.noGic}`,
    blocks: [
      { kind: "h2", text: "Alternatives to a GIC" }, { kind: "ul", items: ["Bank balance with a clear, six-month, explainable source", "A sanctioned education loan covering year-one tuition + living", "A sponsor's documented income, tax returns and assets", "Scholarship/assistantship letters"] },
      { kind: "callout", text: EXTRA.noGic },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [
      { q: "Is a GIC mandatory for Canada?", a: "No — it's optional, but it's the cleanest single proof of living funds since SDS ended." },
      { q: `Can ${c.demonym} students apply without a GIC?`, a: "Yes, with strong alternative proof of funds — but expect closer scrutiny of the source." },
    ],
    related: [`gic-canada-for-${c.slug}-students`, `proof-of-funds-canada-study-visa-${c.slug}`, `education-loan-for-canada-from-${c.slug}`],
  }));
  all.push(makeArticle({
    slug: `canada-study-permit-refusal-and-reapply-from-${c.slug}`,
    category: "visa", categoryLabel: "Visa guide", country: c.code,
    title: `Canada Study Permit Refusal & Reapply from ${c.name} (2026): GCMS Notes`,
    description: `What ${c.demonym} students do after a Canada study permit refusal in 2026 — order GCMS notes, fix the real issue, and reapply the right way.`,
    keywords: [`canada study permit refusal reapply ${c.demonym.toLowerCase()}`, `gcms notes canada ${c.name.toLowerCase()}`, `canada visa rejected ${c.demonym.toLowerCase()} what to do`],
    intro: `A refusal is a setback, not a ban. The single most important step for ${c.demonym} applicants: ${EXTRA.gcms}`,
    blocks: [
      { kind: "callout", text: EXTRA.gcms },
      { kind: "h2", text: "Reapply the right way" }, { kind: "ol", items: ["Order and read your GCMS notes", "Identify the exact concern (funds source, ties, SOP, course fit)", "Fix that specific issue with stronger evidence", "Reapply with a clear Letter of Explanation addressing it"] },
      { kind: "h2", text: "Common refusal reasons" }, { kind: "ul", items: c.refusalReasons },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [
      { q: "What are GCMS notes?", a: EXTRA.gcms },
      { q: "Can I reapply after a study permit refusal?", a: "Yes — read your GCMS notes, fix the specific concern, and reapply with stronger evidence." },
    ],
    related: [`canada-student-visa-refusal-reasons-${c.slug}`, `proof-of-funds-canada-study-visa-${c.slug}`, `sop-for-canada-student-visa-from-${c.slug}`],
  }));
  all.push(makeArticle({
    slug: `gic-refund-process-canada-for-${c.slug}-students`,
    category: "funds", categoryLabel: "Funds guide", country: c.code,
    title: `GIC Refund Process for ${c.demonym} Students (2026): If Your Visa Is Refused`,
    description: `How ${c.demonym} students get a GIC refund if the study permit is refused or they don't travel — steps, timeline and fees for 2026.`,
    keywords: [`gic refund process ${c.demonym.toLowerCase()}`, `gic refund canada ${c.name.toLowerCase()}`, `gic refund if visa rejected`],
    intro: `Worried about your GIC if the visa doesn't come through? ${EXTRA.gicRefund}`,
    blocks: [
      { kind: "callout", text: EXTRA.gicRefund },
      { kind: "h2", text: "How to claim it" }, { kind: "ol", items: ["Log in to your GIC provider's portal and open a refund request", "Attach proof (refusal letter or withdrawal)", "Confirm the destination account", "Wait ~4–7 weeks; a small admin/wire fee is deducted"] },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: "Is the GIC refundable if my visa is refused?", a: EXTRA.gicRefund }],
    related: [`gic-canada-for-${c.slug}-students`, `study-in-canada-without-gic-from-${c.slug}`, `canada-study-permit-refusal-and-reapply-from-${c.slug}`],
  }));
}
// general 1-year master + pg diploma + pr-friendly + gic-refund
all.push(qa("can-i-get-pr-after-1-year-masters-in-canada", "Can I get PR after a 1-year master's in Canada?", `Yes — ${EXTRA.oneYearMaster} ${CANADA.pgwp.prPath}`, undefined, ["1-year-masters-in-canada-for-india-students", "pgwp-and-pr-after-studying-in-canada-india"]));
all.push(qa("is-gic-refundable-canada", "Is the GIC refundable for Canada?", EXTRA.gicRefund, undefined, ["gic-refund-process-canada-for-india-students", "gic-canada-for-india-students"]));
all.push(qa("pr-friendly-courses-in-canada-2026", "What are the most PR-friendly courses in Canada (2026)?", `Courses that map to TEER 0/1/2/3 jobs align best with Express Entry/PNP: ${EXTRA.prFields.join(", ")}. Pair the field with a PGWP-eligible programme.`, undefined, ["pr-friendly-courses-in-canada-for-india-students", "best-courses-to-study-in-canada-for-india-students"]));

// ── Category 23: best universities per city ────────────────────────────────
for (const ci of CITIES) {
  const here = INSTITUTIONS.filter((i) => i.city === ci.name);
  if (!here.length) continue;
  all.push(makeArticle({
    slug: `best-universities-in-${ci.slug}-for-international-students`,
    category: "lists", categoryLabel: "Best-of list",
    title: `Best Universities & Colleges in ${ci.name} for International Students (2026)`,
    description: `Top DLIs in ${ci.name}, ${ci.province} for international students — costs, programmes and living (${ci.monthly}/month) for 2026.`,
    keywords: [`best universities in ${ci.name.toLowerCase()}`, `colleges in ${ci.name.toLowerCase()} international students`, `study in ${ci.name.toLowerCase()}`],
    intro: `Studying in ${ci.name}? Here are the institutions students shortlist, with honest costs. ${ci.note}`,
    blocks: [
      { kind: "table", head: ["Institution", "Type", "Tuition (CAD/yr)", "Known for"], rows: here.map((i) => [i.name, i.type, i.tuition, i.notable.join(", ")]) },
      { kind: "p", text: `Budget about ${ci.monthly}/month to live in ${ci.name}.` },
      { kind: "p", text: NO_GUARANTEE },
    ],
    faqs: [{ q: `Which university in ${ci.name} is best for international students?`, a: `It depends on your field and budget — compare the institutions above on cost, programme and PGWP eligibility.` }],
    related: [`cost-of-living-in-${ci.slug}-for-students`, `student-accommodation-in-${ci.slug}`, "best-cities-in-canada-for-international-students"],
  }));
}

// ── Category 24: settling-in practicals (per country) ──────────────────────
const PRACTICALS: { slug: string; title: (n: string) => string; a: string; kw: string[] }[] = [
  { slug: "health-insurance-for-international-students-in-canada", title: (n) => `Health Insurance for International Students in Canada (${n} Guide, 2026)`, a: "Coverage depends on your province: some (e.g., BC, Alberta, Saskatchewan, Manitoba, Newfoundland) cover eligible international students under the provincial plan after a waiting period; others (e.g., Ontario) require private/university insurance (UHIP). Always arrange cover before classes start.", kw: ["health insurance international students canada", "uhip canada", "provincial health card students"] },
  { slug: "open-a-bank-account-in-canada-international-student", title: () => "How to Open a Bank Account in Canada as an International Student (2026)", a: "Bring your passport, study permit, proof of enrolment and a Canadian address. Major banks (Scotiabank, RBC, TD, CIBC, BMO) offer no-fee student accounts; if you bought a GIC, you'll often activate the linked account on arrival.", kw: ["open bank account canada international student", "best student bank account canada", "canada bank account study permit"] },
  { slug: "sin-number-for-international-students-in-canada", title: () => "SIN Number for International Students in Canada (2026): How to Get One", a: "A Social Insurance Number (SIN) is required to work in Canada. Apply free at a Service Canada centre or online once you arrive, using your study permit (it must mention that you're allowed to work). It's usually issued the same day in person.", kw: ["sin number international students canada", "how to get sin canada student", "social insurance number study permit"] },
  { slug: "tax-for-international-students-in-canada", title: () => "Tax for International Students in Canada (2026): The Basics", a: "If you work or have Canadian income, you generally file a tax return (often by late April). Many students get refunds or benefits (e.g., GST/HST credit) by filing — even with low income, filing is usually worth it. Keep your T4 slips and tuition (T2202) forms.", kw: ["tax for international students canada", "do international students file taxes canada", "t2202 tuition tax"] },
];
for (const pr of PRACTICALS) for (const c of SOURCE_COUNTRIES) {
  all.push(makeArticle({
    slug: `${pr.slug}-${c.slug}`,
    category: "planning", categoryLabel: "Planning", country: c.code,
    title: pr.title(c.demonym).replace("(", `for ${c.demonym} Students (`),
    description: `${pr.a.slice(0, 150)}`,
    keywords: pr.kw.map((k) => `${k} ${c.demonym.toLowerCase()}`),
    intro: `${pr.a}`,
    blocks: [{ kind: "h2", text: "What to do" }, { kind: "p", text: pr.a }, { kind: "p", text: c.parentLangNote }, { kind: "p", text: NO_GUARANTEE }],
    faqs: [{ q: pr.title(c.demonym), a: pr.a }],
    related: [`after-landing-in-canada-checklist-${c.slug}`, `study-in-canada-from-${c.slug}`, `cost-of-studying-in-canada-from-${c.slug}`],
  }));
}

// ── Category 25: more general explainers / Q&A ─────────────────────────────
const MORE_QA: [string, string, string, string[]][] = [
  ["study-permit-vs-visa-canada-difference", "Study permit vs visa for Canada: what's the difference?", "A study permit is the document that lets you study in Canada; a temporary resident visa (TRV) or eTA is the travel document that lets you enter. IRCC usually issues the visa alongside an approved study permit — you need both.", ["canada-student-visa-from-india", "how-to-apply-for-canada-student-visa-from-india"]],
  ["what-is-a-co-op-work-permit-canada", "What is a co-op work permit in Canada?", "If your programme has a mandatory work placement, you apply for a co-op (or intern) work permit alongside your study permit. It only covers placements that are a required part of your course — it's separate from the 24-hour off-campus rule.", ["co-op-programs-in-canada-for-india-students", "can-i-work-while-studying-in-canada"]],
  ["how-to-get-a-pal-certificate-canada", "How do I get a PAL (Provincial Attestation Letter)?", "Your institution or province issues the PAL after you accept your offer — usually once you've paid tuition (in part or full). " + CANADA.pal, ["what-is-a-pal-canada", "do-i-need-a-pal-for-canada-from-india"]],
  ["can-i-stack-two-diplomas-for-3-year-pgwp", "Can I stack two diplomas for a 3-year PGWP in Canada?", EXTRA.pgDiploma, ["pg-diploma-courses-in-canada-for-india-students", "pgwp-and-pr-after-studying-in-canada-india"]],
  ["moi-letter-format-for-canada", "What should a Medium of Instruction (MOI) letter contain for Canada?", "An MOI letter is issued on official institutional letterhead, signed by the registrar, stating that your entire prior programme — instruction and examinations — was in English. It supports admission where accepted, but never replaces IELTS/PTE for the study permit or PGWP.", ["moi-vs-ielts-for-canada", "study-in-canada-without-ielts-from-nepal"]],
  ["how-to-show-source-of-funds-for-canada-study-visa", "How do I show the source of funds for a Canada study visa?", "Trace every major amount: salary slips and tax returns for income, sale deeds for property, loan sanction letters for loans, and gift affidavits for family support. A clean, explainable trail matters more than the headline balance.", ["proof-of-funds-canada-study-visa-india", "bank-statement-for-canada-student-visa-india"]],
];
for (const [slug, q, a, related] of MORE_QA) all.push(qa(slug, q, a, undefined, related));

// ── dedupe + export ────────────────────────────────────────────────────────
const seen = new Set<string>();
export const ARTICLES: Article[] = all.filter((a) => {
  if (seen.has(a.slug)) return false;
  seen.add(a.slug);
  return true;
});

export const ARTICLE_BY_SLUG: Map<string, Article> = new Map(ARTICLES.map((a) => [a.slug, a]));
export const ARTICLE_SLUGS: string[] = ARTICLES.map((a) => a.slug);

export const CATEGORIES = Array.from(new Set(ARTICLES.map((a) => a.category))).map((cat) => {
  const sample = ARTICLES.find((a) => a.category === cat)!;
  return { key: cat, label: sample.categoryLabel, count: ARTICLES.filter((a) => a.category === cat).length };
});

export function relatedArticles(a: Article, n = 4): Article[] {
  const out = a.related.map((s) => ARTICLE_BY_SLUG.get(s)).filter((x): x is Article => Boolean(x));
  if (out.length < n) {
    for (const o of ARTICLES) {
      if (out.length >= n) break;
      if (o.slug !== a.slug && o.category === a.category && !out.includes(o)) out.push(o);
    }
  }
  return out.slice(0, n);
}

export { SOURCES, countryByCode };
