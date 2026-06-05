// Centralised marketing content so the page, JSON-LD and llms.txt stay in sync.
// English source of truth (see docs/05-reference/ui-microcopy.md). i18n (BN/HI/NE)
// is a separate goal (G010); copy here is keyed conceptually for that later swap.

export type Feature = {
  icon: string; // lucide-react icon name
  title: string;
  body: string;
};

export const FEATURES: Feature[] = [
  {
    icon: "Target",
    title: "Eligibility match",
    body: "Build a profile in ten minutes and see the programmes you genuinely qualify for — reach, match and safe — with real cost estimates.",
  },
  {
    icon: "UserCheck",
    title: "A counsellor who owns it",
    body: "One dedicated counsellor guides your shortlist, applications and timelines. No bouncing between agents.",
  },
  {
    icon: "FolderCheck",
    title: "Document vault",
    body: "Upload each document once. We check legibility and consistency, then reuse it across every application automatically.",
  },
  {
    icon: "ShieldCheck",
    title: "Regulated visa sign-off",
    body: "Every visa file is reviewed and signed off by a licensed compliance lead (RCIC/MARA), with a full, tamper-evident audit trail.",
  },
  {
    icon: "Users",
    title: "Parents stay in the loop",
    body: "Parents and sponsors see every milestone and approve payments — in Bangla, Hindi or Nepali — without lifting your workload.",
  },
  {
    icon: "Wallet",
    title: "Payments & GIC, handled",
    body: "Tuition deposits, GIC and service fees flow through secure, multi-currency payments. Nothing off-platform, ever.",
  },
];

export const JOURNEY: { stage: number; name: string }[] = [
  { stage: 1, name: "Profile & Eligibility" },
  { stage: 2, name: "Counsellor Onboarding" },
  { stage: 3, name: "Shortlist" },
  { stage: 4, name: "Application Prep" },
  { stage: 5, name: "Application Submitted" },
  { stage: 6, name: "University Decision" },
  { stage: 7, name: "Tuition & GIC" },
  { stage: 8, name: "Visa" },
  { stage: 9, name: "Pre-Departure & Arrival" },
];

export type Destination = {
  code: string;
  name: string;
  blurb: string;
};

export const DESTINATIONS: Destination[] = [
  {
    code: "CA",
    name: "Canada",
    blurb: "Post-study work, clear PR pathways, and GIC-backed visa routes.",
  },
  {
    code: "GB",
    name: "United Kingdom",
    blurb: "One-year master's, the Graduate Route, and world-ranked universities.",
  },
  {
    code: "AU",
    name: "Australia",
    blurb: "Strong post-study work rights and high quality of life.",
  },
  {
    code: "MY",
    name: "Malaysia",
    blurb: "Affordable, English-taught degrees and global branch campuses.",
  },
];

export const STATS: { value: string; label: string }[] = [
  { value: "4", label: "Study destinations" },
  { value: "9", label: "Guided journey stages" },
  { value: "30+", label: "Partner universities" },
  { value: "100%", label: "Visa files with licensed sign-off" },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Which countries can I apply to through EduNomad?",
    a: "Phase one focuses on Canada, with the United Kingdom, Australia and Malaysia rolling out. You build one profile and we match you to programmes across these destinations.",
  },
  {
    q: "Do I need an IELTS score to start?",
    a: "No. You can start without a test. We support medium-of-instruction letters and test-optional pathways, and we'll tell you exactly what each programme needs.",
  },
  {
    q: "How do my parents follow my progress?",
    a: "Parents and sponsors get their own secure view of every milestone and can approve payments — in Bangla, Hindi or Nepali — without needing to manage anything themselves.",
  },
  {
    q: "Who signs off my visa application?",
    a: "Only a licensed compliance lead (RCIC for Canada, MARA for Australia) can sign off a visa file. Every step is recorded in a tamper-evident audit trail.",
  },
  {
    q: "How are payments handled?",
    a: "Tuition deposits, GIC and service fees go through secure, multi-currency payments inside the platform. There are no off-platform cash flows.",
  },
  {
    q: "How do I get in touch?",
    a: "Tap the WhatsApp or call button on this page. We automatically show the right number for your country so you reach a local team.",
  },
];
