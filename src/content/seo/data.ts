// EduNomad — SEO/LLM content data layer.
//
// Researched, source-grounded facts for the Bangladesh / India / Nepal → Canada
// study corridors. Everything here is composed by the article generator
// (./articles.ts) into 600+ guide pages. Keep figures HONEST: ranges + "verify
// on the official source", never invented precision. Key facts verified June 2026
// (see SOURCES). When IRCC rules change, update this file and every page updates.

export type CountryCode = "BD" | "IN" | "NP";

export type SourceCountry = {
  code: CountryCode;
  name: string;
  demonym: string; // "Bangladeshi"
  slug: string; // "bangladesh"
  currency: string; // "BDT"
  capital: string;
  /** Approx. local-currency equivalent of CAD 20,635 proof of funds (for intuition only). */
  proofOfFundsLocal: string;
  ieltsTypical: string;
  specialDoc?: { name: string; detail: string };
  financeNotes: string[];
  refusalReasons: string[];
  localSteps: string[];
  visaCentre: string;
  loanNote: string;
  parentLangNote: string;
};

export const SOURCE_COUNTRIES: SourceCountry[] = [
  {
    code: "BD",
    name: "Bangladesh",
    demonym: "Bangladeshi",
    slug: "bangladesh",
    currency: "BDT",
    capital: "Dhaka",
    proofOfFundsLocal: "about BDT 18,50,000 (living costs alone, on top of tuition)",
    ieltsTypical: "IELTS 6.0–6.5 overall for most diplomas and bachelor's; 6.5 for many master's, with no band below 6.0",
    specialDoc: {
      name: "Bank solvency certificate",
      detail:
        "Bangladeshi applicants typically attach a bank solvency certificate plus six months of consistent statements. Sudden large deposits with no paper trail are a leading refusal trigger.",
    },
    financeNotes: [
      "Show first-year tuition + at least CAD 20,635 living costs (CAD 22,895 for applications on or after 1 September 2026), held in a verifiable, explainable source.",
      "A GIC from Scotiabank, ICICI Bank Canada or CIBC is the cleanest single proof; it releases roughly CAD 1,700–1,900 to you each month after you land.",
      "Income tax returns, salary slips and property valuations of your sponsor strengthen the file far more than a freshly inflated balance.",
    ],
    refusalReasons: [
      "Funds below the required threshold, or a balance that appeared suddenly with no source",
      "Inconsistent six-month bank history or unexplained third-party deposits",
      "A statement of purpose that reads like a template and does not tie the programme to a clear plan back home",
      "Weak ties / unclear intent to return, or a programme that does not match your past study",
    ],
    localSteps: [
      "Sit IELTS (General Training is required for the later PGWP; Academic is fine for admission) or arrange a medium-of-instruction letter where accepted",
      "Get a Letter of Acceptance from a Designated Learning Institution (DLI)",
      "Open and fund a GIC, and pay the tuition deposit your offer requires",
      "Complete the upfront medical exam with an IRCC panel physician in Dhaka",
      "Apply online via the IRCC portal and give biometrics at VFS Global Dhaka",
    ],
    visaCentre: "VFS Global, Dhaka (biometrics for IRCC)",
    loanNote:
      "Bangladeshi banks offer limited foreign-education loans; most families fund through savings, property and sponsor income, so documenting the source of funds matters more than the headline number.",
    parentLangNote: "Parents and sponsors follow every milestone in Bangla.",
  },
  {
    code: "IN",
    name: "India",
    demonym: "Indian",
    slug: "india",
    currency: "INR",
    capital: "New Delhi",
    proofOfFundsLocal: "about ₹13–15.3 lakh for the GIC alone, plus first-year tuition",
    ieltsTypical: "IELTS 6.0–6.5 (no band below 6.0 for many master's); PTE 50–60; some colleges accept the Duolingo English Test for admission",
    financeNotes: [
      "Most Indian students fund through an education loan plus a GIC. SBI's Global Ed-Vantage is the market leader — roughly 8.5%–10.15% interest, limits up to ₹1.5 crore, covering tuition, GIC, living, airfare and insurance.",
      "The GIC is CAD 20,635 (rising to CAD 22,895 for applications on or after 1 September 2026) — about ₹13–15.3 lakh — locked in a Canadian account and released to you monthly.",
      "IRCC applies extra scrutiny to Indian financial documents: expect to show several months of statements and, sometimes, an affidavit explaining the source of funds.",
    ],
    refusalReasons: [
      "A loan sanction letter that does not clearly cover tuition + living for year one",
      "Funds parked just before applying, with no consistent history",
      "A study plan that looks like a back-door immigration route rather than a genuine programme choice",
      "Course not aligned with prior academics or work experience",
    ],
    localSteps: [
      "Take IELTS / PTE (or use a medium-of-instruction letter for admission where accepted)",
      "Secure your Letter of Acceptance from a DLI",
      "Sanction your education loan and transfer the GIC to an approved Canadian bank",
      "Complete the upfront medical with an IRCC panel physician",
      "Apply online and give biometrics at a VFS Global centre (Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata, Chandigarh and more)",
    ],
    visaCentre: "VFS Global (Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata, Chandigarh, Pune, Ahmedabad and others)",
    loanNote:
      "Education loans are the norm: SBI Global Ed-Vantage, Bank of Baroda, plus NBFCs like HDFC Credila, Avanse and Prodigy. Compare interest, moratorium and whether the GIC is disbursed directly to Canada.",
    parentLangNote: "Parents and sponsors follow every milestone in Hindi.",
  },
  {
    code: "NP",
    name: "Nepal",
    demonym: "Nepali",
    slug: "nepal",
    currency: "NPR",
    capital: "Kathmandu",
    proofOfFundsLocal: "roughly NPR 30+ lakh for living and the GIC, plus tuition",
    ieltsTypical: "IELTS 6.5 with no band below 6.0 is the common target; TOEFL iBT 88+ or PTE 60+ are widely accepted",
    specialDoc: {
      name: "No Objection Certificate (NOC)",
      detail:
        "Nepali students must obtain an NOC from the Ministry of Education (MoEST) online portal — about NPR 2,000, issued in roughly 3–5 working days. It is mandatory for both self-funded and sponsored students and for bank transfers abroad.",
    },
    financeNotes: [
      "You generally show CAD 20,635 living costs (CAD 22,895 from 1 September 2026) plus first-year tuition, often via a GIC.",
      "The NOC is required before money can be remitted abroad for tuition and the GIC, so plan it into your timeline.",
      "Bank balance certificates, source-of-income evidence and a sponsor's tax history make a far stronger file than a last-minute deposit.",
    ],
    refusalReasons: [
      "Missing or mismatched NOC details",
      "Funds that cannot be traced to a clear, taxed source",
      "A statement of purpose that does not connect the course to a plan in Nepal",
      "Academic gap or course mismatch left unexplained",
    ],
    localSteps: [
      "Register and apply for the NOC on the MoEST portal",
      "Take IELTS / PTE / TOEFL (or use an MOI letter for admission where accepted)",
      "Secure your DLI Letter of Acceptance",
      "Arrange the GIC and pay your tuition deposit (after the NOC clears the transfer)",
      "Complete the medical, then apply online and give biometrics at VFS Global Kathmandu",
    ],
    visaCentre: "VFS Global, Kathmandu (biometrics for IRCC)",
    loanNote:
      "Nepali banks offer education loans against collateral; the NOC and a clean source-of-funds trail are usually the gating items, not the loan itself.",
    parentLangNote: "Parents and sponsors follow every milestone in Nepali.",
  },
];

export const countryBySlug = (slug: string) => SOURCE_COUNTRIES.find((c) => c.slug === slug);
export const countryByCode = (code: CountryCode) => SOURCE_COUNTRIES.find((c) => c.code === code)!;

// ── Canada destination facts (verified June 2026) ──────────────────────────
export const CANADA = {
  proofOfFundsCad: 20635,
  proofOfFundsCadFromSep2026: 22895,
  gicMonthlyReleaseCad: "1,700–1,900",
  gicBanks: ["Scotiabank", "ICICI Bank Canada", "CIBC", "RBC", "SBI Canada"],
  studyPermitFeeCad: 150,
  biometricsFeeCad: 85,
  processingWeeks: "8–12 weeks (regular stream)",
  sds: "The Student Direct Stream (SDS) was discontinued on 8 November 2024. Every applicant now uses the regular study-permit stream — there is no faster IELTS-6.0 / GIC fast-track any more.",
  pal: "Most college and undergraduate applicants need a Provincial/Territorial Attestation Letter (PAL/TAL). Students starting a master's or doctoral degree at a public DLI are exempt from 1 January 2026.",
  cap: "Canada caps new study permits (~360,000 for 2025, similar for 2026), split by province. When a province's allocation fills, no new PALs are issued until the next round — apply early.",
  weeklyWorkHours: 24,
  intakes: [
    { name: "Fall (September)", note: "The main intake — widest choice of programmes and scholarships. Apply roughly Aug–Mar of the prior year." },
    { name: "Winter (January)", note: "A strong second intake with less competition. Apply roughly Sep–Nov." },
    { name: "Spring/Summer (May)", note: "Smaller intake, fewer programmes; useful as a backup." },
  ],
  pgwp: {
    languageRule:
      "Since 1 November 2024 every PGWP applicant must submit a language test: CLB/NCLC 7 for university (bachelor's/master's/doctoral) graduates and CLB/NCLC 5 for college graduates, in all four skills (scores are not averaged).",
    testRule: "PGWP language proof uses IELTS General Training, CELPIP-General or PTE Core — IELTS Academic is not accepted for the PGWP.",
    fieldRule:
      "Graduates of non-degree (college diploma/certificate) programmes must have studied an IRCC-eligible field of study to qualify for a PGWP. University degree graduates are not subject to the field-of-study list.",
    prPath:
      "A PGWP lets you gain Canadian skilled work (NOC TEER 0/1/2/3). After ~1 year you may qualify for PR through the Canadian Experience Class (Express Entry) or a Provincial Nominee Program (PNP).",
  },
  tuitionRangeCad: "roughly CAD 15,000–35,000/year at colleges and CAD 20,000–60,000/year at universities",
};

// ── English tests ──────────────────────────────────────────────────────────
export const TESTS = [
  { slug: "ielts", name: "IELTS", forVisaPgwp: "General Training only", forAdmission: true, typical: "6.0–6.5 overall; 6.5 for many master's", note: "The most widely accepted test. Use IELTS Academic for admission and IELTS General Training for the PGWP later." },
  { slug: "pte", name: "PTE (Academic / Core)", forVisaPgwp: "PTE Core", forAdmission: true, typical: "50–60", note: "Fast results; PTE Academic for admission, PTE Core for the PGWP." },
  { slug: "toefl", name: "TOEFL iBT", forVisaPgwp: "Not accepted for PGWP", forAdmission: true, typical: "80–90", note: "Accepted for admission at most universities; not used for the PGWP language requirement." },
  { slug: "duolingo", name: "Duolingo English Test (DET)", forVisaPgwp: "Not accepted by IRCC", forAdmission: true, typical: "110–125", note: "Cheap and quick; 400+ Canadian institutions accept it for admission, but IRCC does not accept DET — you still need IELTS/PTE for the permit and PGWP." },
  { slug: "moi", name: "Medium of Instruction (MOI) letter", forVisaPgwp: "Not a test", forAdmission: true, typical: "n/a", note: "Some institutions waive a test for admission if your prior degree was taught in English. It is not a language test and cannot replace IELTS/PTE for the study permit or PGWP." },
];

// ── Scholarships (representative; verify amounts on the official source) ─────
export const SCHOLARSHIPS = [
  { name: "Vanier Canada Graduate Scholarships", level: "Doctoral", amount: "CAD 50,000/year for 3 years", who: "Top PhD researchers (health, NSE, social sciences)" },
  { name: "Canada Graduate Scholarships – Master's", level: "Master's", amount: "CAD 27,000 for 1 year", who: "Outstanding master's researchers" },
  { name: "Lester B. Pearson International Scholarship (U of T)", level: "Undergraduate", amount: "Full: tuition, books, fees, residence", who: "Exceptional incoming international undergraduates" },
  { name: "University of Saskatchewan international awards", level: "Master's / PhD", amount: "Up to CAD 16,000–20,000", who: "Strong graduate applicants" },
  { name: "Dalhousie University graduate awards", level: "Master's / PhD", amount: "Up to ~CAD 30,000 with stipend", who: "Funded research students" },
  { name: "University / college entrance scholarships", level: "All", amount: "CAD 1,000–10,000 (automatic or merit)", who: "Many DLIs award these on admission — always check the offer letter" },
];

// ── Canadian cities students choose ─────────────────────────────────────────
export const CITIES = [
  { name: "Toronto", province: "Ontario", slug: "toronto", monthly: "CAD 1,500–2,200", note: "Biggest job market; highest rent — share accommodation early." },
  { name: "Vancouver", province: "British Columbia", slug: "vancouver", monthly: "CAD 1,500–2,200", note: "Mild weather, high cost of living, strong tech and film sectors." },
  { name: "Montreal", province: "Quebec", slug: "montreal", monthly: "CAD 1,100–1,700", note: "Lower rent; Quebec has its own CAQ + selection rules — plan for them." },
  { name: "Calgary", province: "Alberta", slug: "calgary", monthly: "CAD 1,200–1,800", note: "No provincial sales tax, growing job market, affordable vs Toronto." },
  { name: "Ottawa", province: "Ontario", slug: "ottawa", monthly: "CAD 1,200–1,800", note: "Government and tech hub; calmer than Toronto." },
  { name: "Winnipeg", province: "Manitoba", slug: "winnipeg", monthly: "CAD 1,000–1,500", note: "Among the most affordable big cities; Manitoba PNP is student-friendly." },
  { name: "Halifax", province: "Nova Scotia", slug: "halifax", monthly: "CAD 1,200–1,700", note: "Atlantic Canada; AIP pathway and welcoming for newcomers." },
  { name: "Waterloo", province: "Ontario", slug: "waterloo", monthly: "CAD 1,200–1,800", note: "Tech and co-op capital; strong for computing and engineering." },
  { name: "Edmonton", province: "Alberta", slug: "edmonton", monthly: "CAD 1,100–1,600", note: "Affordable, energy and health sectors, Alberta Advantage PNP." },
  { name: "Saskatoon", province: "Saskatchewan", slug: "saskatoon", monthly: "CAD 1,000–1,500", note: "Low cost of living; Saskatchewan PNP draws regularly." },
];

// ── Fields of study (mapped to the platform's catalogue categories) ─────────
export const FIELDS = [
  { slug: "computer-science", name: "Computer Science & IT", careers: "software developer, data analyst, IT support, cloud", note: "Consistently in demand; many co-op options." },
  { slug: "data-science-ai", name: "Data Science & AI", careers: "data scientist, ML engineer, analyst", note: "Fast-growing; strong PR prospects under TEER 1/2." },
  { slug: "business-management", name: "Business & Management", careers: "business analyst, operations, marketing", note: "Broad; pick a specialisation for PGWP/PR alignment." },
  { slug: "mba", name: "MBA", careers: "management, consulting, finance", note: "Two-year MBAs keep PGWP options open; check work-experience entry rules." },
  { slug: "nursing-healthcare", name: "Nursing & Healthcare", careers: "RN, PSW, healthcare aide", note: "High demand; licensing/registration steps apply." },
  { slug: "engineering", name: "Engineering", careers: "civil, mechanical, electrical, software", note: "Strong job market; P.Eng licensing is a separate path." },
  { slug: "public-health", name: "Public Health", careers: "health policy, epidemiology, community health", note: "Popular master's choice; TEER 1 roles." },
  { slug: "accounting-finance", name: "Accounting & Finance", careers: "accountant, financial analyst", note: "CPA pathway available; check credit transfer." },
  { slug: "project-management", name: "Project Management", careers: "project coordinator, PM", note: "Common post-grad diploma; pairs well with prior degrees." },
  { slug: "supply-chain-logistics", name: "Supply Chain & Logistics", careers: "supply chain analyst, operations", note: "In-demand; many PGWP-eligible college diplomas." },
  { slug: "hospitality-tourism", name: "Hospitality & Tourism", careers: "hospitality management, events", note: "Co-op heavy; verify PGWP field eligibility for the diploma." },
  { slug: "cybersecurity", name: "Cybersecurity", careers: "security analyst, SOC, GRC", note: "Growing demand across TEER 1/2 roles." },
  { slug: "early-childhood-education", name: "Early Childhood Education", careers: "ECE, educator", note: "In demand; licensing varies by province." },
  { slug: "mechanical-automation", name: "Mechanical & Automation", careers: "technologist, automation", note: "Strong in Ontario/Alberta manufacturing." },
];

// ── Real Canadian DLIs popular with BD/IN/NP students ───────────────────────
// Figures are honest approximations (international, CAD/yr) — verify on the
// institution's official site. `type`: university (degree → PGWP without a
// field list) or college (diploma → PGWP needs an eligible field of study).
export type Institution = {
  slug: string; name: string; city: string; province: string;
  type: "university" | "college"; tuition: string; notable: string[]; note: string;
};

export const INSTITUTIONS: Institution[] = [
  { slug: "university-of-toronto", name: "University of Toronto", city: "Toronto", province: "Ontario", type: "university", tuition: "CAD 45,000–65,000", notable: ["Computer Science", "Engineering", "Business (Rotman)"], note: "Canada's top-ranked research university; competitive admissions." },
  { slug: "university-of-british-columbia", name: "University of British Columbia", city: "Vancouver", province: "British Columbia", type: "university", tuition: "CAD 42,000–58,000", notable: ["Computer Science", "Engineering", "Commerce"], note: "Top-3 Canadian university; strong co-op." },
  { slug: "mcgill-university", name: "McGill University", city: "Montreal", province: "Quebec", type: "university", tuition: "CAD 30,000–55,000", notable: ["Engineering", "Management", "Sciences"], note: "World-ranked; Quebec has extra CAQ steps." },
  { slug: "university-of-waterloo", name: "University of Waterloo", city: "Waterloo", province: "Ontario", type: "university", tuition: "CAD 45,000–65,000", notable: ["Computer Science", "Engineering", "Mathematics"], note: "Famous for paid co-op and tech recruiting." },
  { slug: "university-of-alberta", name: "University of Alberta", city: "Edmonton", province: "Alberta", type: "university", tuition: "CAD 30,000–42,000", notable: ["Engineering", "Computing Science", "Sciences"], note: "Strong research; affordable city." },
  { slug: "mcmaster-university", name: "McMaster University", city: "Hamilton", province: "Ontario", type: "university", tuition: "CAD 38,000–60,000", notable: ["Health Sciences", "Engineering", "Business"], note: "Renowned for health and problem-based learning." },
  { slug: "university-of-calgary", name: "University of Calgary", city: "Calgary", province: "Alberta", type: "university", tuition: "CAD 28,000–45,000", notable: ["Engineering", "Business (Haskayne)", "Computer Science"], note: "Growing tech scene; no provincial sales tax." },
  { slug: "university-of-ottawa", name: "University of Ottawa", city: "Ottawa", province: "Ontario", type: "university", tuition: "CAD 38,000–58,000", notable: ["Computer Science", "Engineering", "Public Policy"], note: "Bilingual; co-op and government links." },
  { slug: "western-university", name: "Western University", city: "London", province: "Ontario", type: "university", tuition: "CAD 38,000–60,000", notable: ["Business (Ivey)", "Engineering", "Health"], note: "Strong campus life and business reputation." },
  { slug: "dalhousie-university", name: "Dalhousie University", city: "Halifax", province: "Nova Scotia", type: "university", tuition: "CAD 25,000–40,000", notable: ["Engineering", "Health", "Computer Science"], note: "Atlantic Canada; AIP pathway." },
  { slug: "university-of-saskatchewan", name: "University of Saskatchewan", city: "Saskatoon", province: "Saskatchewan", type: "university", tuition: "CAD 22,000–35,000", notable: ["Agriculture", "Engineering", "Health"], note: "Affordable; student-friendly SINP." },
  { slug: "university-of-manitoba", name: "University of Manitoba", city: "Winnipeg", province: "Manitoba", type: "university", tuition: "CAD 20,000–32,000", notable: ["Engineering", "Computer Science", "Agriculture"], note: "Low cost of living; Manitoba PNP." },
  { slug: "university-of-windsor", name: "University of Windsor", city: "Windsor", province: "Ontario", type: "university", tuition: "CAD 30,000–42,000", notable: ["Computer Science (MAC)", "Engineering", "Business"], note: "Popular master's of applied computing; near Detroit." },
  { slug: "toronto-metropolitan-university", name: "Toronto Metropolitan University", city: "Toronto", province: "Ontario", type: "university", tuition: "CAD 33,000–45,000", notable: ["Engineering", "Business", "Computing"], note: "Career-focused; downtown Toronto." },
  { slug: "york-university", name: "York University", city: "Toronto", province: "Ontario", type: "university", tuition: "CAD 33,000–45,000", notable: ["Business (Schulich)", "Computing", "Liberal Arts"], note: "Large, diverse; many pathways." },
  { slug: "carleton-university", name: "Carleton University", city: "Ottawa", province: "Ontario", type: "university", tuition: "CAD 33,000–48,000", notable: ["Engineering", "Computer Science", "Public Affairs"], note: "Strong co-op and government links." },
  { slug: "concordia-university", name: "Concordia University", city: "Montreal", province: "Quebec", type: "university", tuition: "CAD 28,000–48,000", notable: ["Engineering", "Business (JMSB)", "Computer Science"], note: "Practical focus; affordable Montreal." },
  { slug: "memorial-university", name: "Memorial University of Newfoundland", city: "St. John's", province: "Newfoundland and Labrador", type: "university", tuition: "CAD 20,000–30,000", notable: ["Engineering", "Computer Science", "Marine"], note: "Among the most affordable universities." },
  { slug: "cape-breton-university", name: "Cape Breton University", city: "Sydney", province: "Nova Scotia", type: "university", tuition: "CAD 19,000–28,000", notable: ["Business (MBA)", "Public Health", "Computing"], note: "Very popular with South Asian students; AIP." },
  { slug: "thompson-rivers-university", name: "Thompson Rivers University", city: "Kamloops", province: "British Columbia", type: "university", tuition: "CAD 20,000–30,000", notable: ["Business", "Computing", "Trades"], note: "Affordable BC; co-op options." },
  { slug: "university-of-regina", name: "University of Regina", city: "Regina", province: "Saskatchewan", type: "university", tuition: "CAD 20,000–30,000", notable: ["Engineering", "Business", "Computer Science"], note: "Affordable; SINP friendly." },
  { slug: "brock-university", name: "Brock University", city: "St. Catharines", province: "Ontario", type: "university", tuition: "CAD 28,000–40,000", notable: ["Business", "Computing", "Health"], note: "Co-op; Niagara region." },
  { slug: "lakehead-university", name: "Lakehead University", city: "Thunder Bay", province: "Ontario", type: "university", tuition: "CAD 28,000–38,000", notable: ["Engineering", "Computer Science", "Business"], note: "Smaller classes; affordable." },
  { slug: "trent-university", name: "Trent University", city: "Peterborough", province: "Ontario", type: "university", tuition: "CAD 28,000–40,000", notable: ["Sciences", "Business", "Computing"], note: "Strong support for international students." },
  { slug: "conestoga-college", name: "Conestoga College", city: "Kitchener", province: "Ontario", type: "college", tuition: "CAD 15,000–22,000", notable: ["IT", "Engineering Technology", "Business"], note: "Public college; one of the largest international intakes — confirm PGWP-eligible fields." },
  { slug: "seneca-polytechnic", name: "Seneca Polytechnic", city: "Toronto", province: "Ontario", type: "college", tuition: "CAD 15,000–24,000", notable: ["Computing", "Business", "Aviation"], note: "Degree + diploma options; university transfer." },
  { slug: "centennial-college", name: "Centennial College", city: "Toronto", province: "Ontario", type: "college", tuition: "CAD 15,000–22,000", notable: ["Engineering Tech", "Business", "Health"], note: "Diverse Toronto college; strong co-op." },
  { slug: "humber-college", name: "Humber Polytechnic", city: "Toronto", province: "Ontario", type: "college", tuition: "CAD 16,000–24,000", notable: ["Business", "Media", "IT"], note: "Polytechnic; degrees and diplomas." },
  { slug: "george-brown-college", name: "George Brown College", city: "Toronto", province: "Ontario", type: "college", tuition: "CAD 16,000–24,000", notable: ["Business", "Health", "Hospitality"], note: "Downtown Toronto; industry links." },
  { slug: "sheridan-college", name: "Sheridan College", city: "Oakville", province: "Ontario", type: "college", tuition: "CAD 16,000–24,000", notable: ["Animation", "Business", "Computing"], note: "World-known for animation and design." },
  { slug: "fanshawe-college", name: "Fanshawe College", city: "London", province: "Ontario", type: "college", tuition: "CAD 14,000–20,000", notable: ["IT", "Business", "Engineering Tech"], note: "Large public college; affordable London." },
  { slug: "niagara-college", name: "Niagara College", city: "Niagara", province: "Ontario", type: "college", tuition: "CAD 15,000–18,000", notable: ["Hospitality", "Business", "Tech"], note: "Among the lower tuition ranges; tourism strength." },
  { slug: "algonquin-college", name: "Algonquin College", city: "Ottawa", province: "Ontario", type: "college", tuition: "CAD 15,000–20,000", notable: ["IT", "Business", "Health"], note: "Ottawa public college; co-op." },
  { slug: "douglas-college", name: "Douglas College", city: "New Westminster", province: "British Columbia", type: "college", tuition: "CAD 17,000–22,000", notable: ["Business", "Health", "Computing"], note: "Affordable BC public college; university transfer." },
  { slug: "langara-college", name: "Langara College", city: "Vancouver", province: "British Columbia", type: "college", tuition: "CAD 17,000–22,000", notable: ["Business", "Computing", "Sciences"], note: "Vancouver transfer pathway to UBC/SFU." },
  { slug: "lambton-college", name: "Lambton College", city: "Sarnia", province: "Ontario", type: "college", tuition: "CAD 14,000–19,000", notable: ["IT", "Business", "Engineering Tech"], note: "Public college; confirm campus and PGWP field." },
  { slug: "northern-college", name: "Northern College", city: "Timmins", province: "Ontario", type: "college", tuition: "CAD 15,000–18,000", notable: ["Business", "IT", "Trades"], note: "Among the most affordable; northern Ontario." },
  { slug: "loyalist-college", name: "Loyalist College", city: "Belleville", province: "Ontario", type: "college", tuition: "CAD 15,000–18,000", notable: ["Business", "Health", "Media"], note: "Smaller public college; lower cost of living." },
  { slug: "cambrian-college", name: "Cambrian College", city: "Sudbury", province: "Ontario", type: "college", tuition: "CAD 15,000–18,000", notable: ["IT", "Business", "Health"], note: "Affordable; northern Ontario." },
  { slug: "bow-valley-college", name: "Bow Valley College", city: "Calgary", province: "Alberta", type: "college", tuition: "CAD 15,000–20,000", notable: ["Business", "Health", "IT"], note: "Calgary public college; career-focused." },
  { slug: "nait", name: "NAIT (Northern Alberta Institute of Technology)", city: "Edmonton", province: "Alberta", type: "college", tuition: "CAD 18,000–25,000", notable: ["Engineering Tech", "IT", "Trades"], note: "Polytechnic; strong industry placement." },
  { slug: "sait", name: "SAIT (Southern Alberta Institute of Technology)", city: "Calgary", province: "Alberta", type: "college", tuition: "CAD 18,000–25,000", notable: ["Engineering Tech", "Business", "IT"], note: "Polytechnic; energy and tech links." },
  { slug: "red-river-college", name: "Red River College Polytechnic", city: "Winnipeg", province: "Manitoba", type: "college", tuition: "CAD 15,000–20,000", notable: ["IT", "Business", "Engineering Tech"], note: "Manitoba PNP friendly; affordable." },
  { slug: "saskatchewan-polytechnic", name: "Saskatchewan Polytechnic", city: "Saskatoon", province: "Saskatchewan", type: "college", tuition: "CAD 15,000–20,000", notable: ["IT", "Business", "Health"], note: "SINP friendly; low cost of living." },
  { slug: "mohawk-college", name: "Mohawk College", city: "Hamilton", province: "Ontario", type: "college", tuition: "CAD 15,000–20,000", notable: ["Engineering Tech", "IT", "Business"], note: "Public college near Toronto/Hamilton." },
  { slug: "durham-college", name: "Durham College", city: "Oshawa", province: "Ontario", type: "college", tuition: "CAD 15,000–20,000", notable: ["IT", "Business", "Skilled Trades"], note: "Greater Toronto Area; co-op." },
];

export const universityCount = INSTITUTIONS.filter((i) => i.type === "university").length;
export const collegeCount = INSTITUTIONS.filter((i) => i.type === "college").length;

// ── Extra researched facts for long-tail + AI-citable pages (June 2026) ─────
export const EXTRA = {
  ielts55Colleges: ["Lethbridge College", "Camosun College", "MacEwan University", "Huron University College", "Athabasca University", "Canadore College"],
  ielts55Note: "Some colleges accept IELTS 5.5 (often with no band below 5.0) for diploma/pathway entry; for the study permit, aim for 6.0 overall with 5.5 in each band for undergraduate/diploma routes.",
  oneYearMaster: "Master's graduates get a 3-year PGWP even when the programme is under two years, and public-DLI master's students are exempt from both the PAL and the study-permit cap. A Canadian master's also adds 135 CRS points under Express Entry.",
  pgDiploma: "A post-graduate diploma runs 1–2 years (about CAD 15,000–25,000/year). A 1-year diploma usually yields a 1-year PGWP; some students stack two 1-year diplomas (1+1) to reach a 3-year PGWP when both programmes qualify.",
  gicRefund: "A GIC is refundable if your study permit is refused, or if you withdraw and return home: submit a refund request to the bank with proof of the decision. Expect roughly 4–7 weeks, less a small (~CAD 200) non-refundable admin/wire fee.",
  prFields: ["Data Science & AI", "Business Analytics", "Healthcare Management", "Information Technology", "International Business"],
  gcms: "Order your GCMS notes after a refusal — they reveal the visa officer's exact concern. Never reapply blindly: the new application must directly fix that concern with stronger, credible evidence.",
  noGic: "You can apply without a GIC by proving funds another way (bank balance with a clear source, a sanctioned education loan, a sponsor's documented income). The GIC is not mandatory — but since SDS ended it remains the cleanest, fastest-to-verify proof.",
};

// ── Citable sources (shown on pages + in llms.txt for E-E-A-T) ──────────────
export const SOURCES = [
  { label: "IRCC — Proof of financial support", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html" },
  { label: "IRCC — Provincial/Territorial Attestation Letter", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html" },
  { label: "IRCC — Post-Graduation Work Permit eligibility", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html" },
  { label: "IRCC — PGWP field-of-study requirement", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility/field-of-study.html" },
  { label: "Government of Nepal — MoEST NOC portal", url: "https://moest.gov.np/" },
];

export const LAST_UPDATED = "2026-06-06";
