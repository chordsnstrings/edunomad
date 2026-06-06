// EduNomad — native-language SEO layer (Bangla / Hindi / Nepali).
//
// Each source country gets its highest-intent cornerstone guides in its own
// language — the queries with the least competition and strongest local intent.
// Register is deliberately bilingual: native prose with English for technical
// terms (IELTS, PGWP, GIC, study permit, CAD figures, university names). That is
// how study-abroad content is genuinely read and searched in these markets, and
// it keeps facts unambiguous. Bodies fall back to the English guide for depth.
//
// Facts mirror ./data.ts (verified June 2026): proof of funds CAD 20,635→22,895,
// SDS discontinued, PGWP language test, etc. Update both together.

import type { Block, Faq } from "./articles";

export type NativeLocale = "bn" | "hi" | "ne";
export const NATIVE_LOCALES: NativeLocale[] = ["bn", "hi", "ne"];
export const LOCALE_LABEL: Record<NativeLocale, string> = { bn: "বাংলা", hi: "हिन्दी", ne: "नेपाली" };
export const LOCALE_NAME: Record<NativeLocale, string> = { bn: "Bangla", hi: "Hindi", ne: "Nepali" };
// Which native locale each country's pages are authored in.
export const COUNTRY_LOCALE: Record<string, NativeLocale> = { bangladesh: "bn", india: "hi", nepal: "ne" };

export type NativeArticle = {
  slug: string; // matches an English ARTICLE slug
  locale: NativeLocale;
  title: string;
  description: string;
  intro: string;
  blocks: Block[];
  faqs: Faq[];
};

const PF = "CAD 20,635 (১ সেপ্টেম্বর ২০২৬ থেকে CAD 22,895)";

// ── Bangla (Bangladesh) ─────────────────────────────────────────────────────
const BN: NativeArticle[] = [
  {
    slug: "study-in-canada-from-bangladesh", locale: "bn",
    title: "বাংলাদেশ থেকে কানাডায় পড়াশোনা (২০২৬): সম্পূর্ণ গাইড",
    description: "বাংলাদেশ থেকে কানাডায় পড়তে যেতে চান? খরচ, proof of funds ও GIC, IELTS, SDS বন্ধ হওয়ার পর study permit, সেরা university এবং PGWP থেকে PR — ২০২৬ সালের সম্পূর্ণ গাইড।",
    intro: "কানাডা এখনও বাংলাদেশি শিক্ষার্থীদের সবচেয়ে পছন্দের গন্তব্য — post-study work, PR-এর সুযোগ আর GIC-ভিত্তিক visa proof-এর জন্য। নিয়মগুলো সম্প্রতি অনেক বদলেছে (SDS বন্ধ, funds বেড়েছে, PGWP-তে এখন language test লাগে), তাই এই গাইডে ২০২৬ সালের সঠিক ধাপগুলো দেওয়া হলো।",
    blocks: [
      { kind: "h2", text: "ভর্তির মূল শর্ত" },
      { kind: "ul", items: [
        "একাডেমিক: diploma/bachelor-এর জন্য স্বীকৃত সার্টিফিকেট; master-এর জন্য bachelor ডিগ্রি।",
        "English: সাধারণত IELTS 6.0–6.5 (অনেক master-এ কোনো band 6.0-এর নিচে নয়)।",
        `টাকা: first-year tuition + living খরচ হিসেবে ${PF} দেখাতে হবে — বাংলাদেশের জন্য প্রায় BDT ১৮,৫০,০০০ (শুধু living)।`,
        "Bank solvency certificate ও ৬ মাসের consistent statement; হঠাৎ বড় deposit refusal-এর বড় কারণ।",
      ] },
      { kind: "h2", text: "Study permit-এর ধাপ (SDS-এর পর)" },
      { kind: "callout", text: "Student Direct Stream (SDS) ৮ নভেম্বর ২০২৪-এ বন্ধ হয়ে গেছে। এখন সবাই regular stream-এ আবেদন করে — processing প্রায় ৮–১২ সপ্তাহ।" },
      { kind: "ol", items: [
        "IELTS দিন (পরে PGWP-এর জন্য General Training লাগবে)",
        "DLI থেকে Letter of Acceptance নিন",
        "GIC খুলুন ও tuition deposit দিন",
        "Dhaka-তে IRCC panel physician-এর কাছে medical করান",
        "IRCC portal-এ online আবেদন করুন, VFS Global Dhaka-তে biometrics দিন",
      ] },
      { kind: "h2", text: "PGWP ও PR" },
      { kind: "p", text: "PGWP-এর জন্য এখন language test বাধ্যতামূলক (university graduate-দের CLB 7, college-দের CLB 5)। PGWP দিয়ে skilled কাজ (TEER 0/1/2/3) করে প্রায় ১ বছরে Express Entry/PNP-র মাধ্যমে PR-এর পথ খোলে।" },
      { kind: "p", text: "EduNomad আপনার পুরো file গুছিয়ে দেয়, কিন্তু admission বা visa-র সিদ্ধান্ত university ও IRCC-র — আমরা কখনো ফল নিশ্চয়তা দিই না।" },
    ],
    faqs: [
      { q: "২০২৬-এ বাংলাদেশিদের জন্য SDS কি আছে?", a: "না। SDS ৮ নভেম্বর ২০২৪-এ বন্ধ হয়েছে; এখন সবাই regular stream-এ আবেদন করে (প্রায় ৮–১২ সপ্তাহ)।" },
      { q: "কানাডায় পড়তে কত টাকা দেখাতে হয়?", a: `First-year tuition + ${PF} (living)। বাংলাদেশের জন্য living অংশ প্রায় BDT ১৮,৫০,০০০।` },
      { q: "IELTS ছাড়া কানাডায় পড়া যায়?", a: "Admission-এর জন্য কখনো কখনো (MOI letter বা Duolingo) — কিন্তু study permit ও PGWP-এর জন্য IELTS/PTE লাগবেই।" },
    ],
  },
  {
    slug: "canada-student-visa-from-bangladesh", locale: "bn",
    title: "বাংলাদেশ থেকে কানাডা Student Visa (২০২৬): শর্ত ও প্রক্রিয়া",
    description: "২০২৬-এ বাংলাদেশি শিক্ষার্থীদের কানাডা study permit-এর সম্পূর্ণ checklist — documents, proof of funds, biometrics, processing time এবং refusal এড়ানোর উপায়।",
    intro: "কানাডার \"student visa\" আসলে একটি study permit (সাথে travel-এর জন্য visa)। ২০২৬-এ বাংলাদেশি আবেদনকারীরা ঠিক কী জমা দেন এবং কোন ভুলে refusal হয়, তা এখানে দেওয়া হলো।",
    blocks: [
      { kind: "h2", text: "যেসব document লাগে" },
      { kind: "ul", items: ["বৈধ passport", "DLI থেকে Letter of Acceptance", `Proof of funds — ${PF}`, "GIC certificate / tuition receipt", "Bank solvency certificate", "Statement of Purpose (SOP)", "Academic transcript ও certificate", "IELTS/PTE result", "Medical ও biometrics"] },
      { kind: "callout", text: "বেশিরভাগ college/undergraduate আবেদনকারীর PAL/TAL লাগে; public DLI-তে master/PhD শুরু করলে ১ জানুয়ারি ২০২৬ থেকে PAL লাগে না।" },
      { kind: "h2", text: "কেন file refuse হয়" },
      { kind: "ul", items: ["funds threshold-এর নিচে বা হঠাৎ আসা balance", "inconsistent ৬ মাসের statement বা ব্যাখ্যাহীন deposit", "template-এর মতো SOP", "দেশে ফেরার দুর্বল intent বা course mismatch"] },
      { kind: "p", text: "EduNomad file গুছিয়ে দেয়, তবে কখনো visa-র ফল নিশ্চয়তা দেয় না।" },
    ],
    faqs: [
      { q: "বাংলাদেশিরা কোথায় biometrics দেয়?", a: "VFS Global, Dhaka-তে।" },
      { q: "Visa fee কত?", a: "Study permit CAD 150 + biometrics CAD 85।" },
    ],
  },
  {
    slug: "cost-of-studying-in-canada-from-bangladesh", locale: "bn",
    title: "বাংলাদেশ থেকে কানাডায় পড়ার খরচ (২০২৬): Tuition + Living",
    description: "২০২৬-এ বাংলাদেশি শিক্ষার্থীদের জন্য বাস্তব বাজেট — tuition, proof of funds, GIC, flight, insurance এবং শহরভিত্তিক living খরচ।",
    intro: "সঠিকভাবে বাজেট করাই আপনার visa file-কে সবচেয়ে বেশি রক্ষা করে। ২০২৬-এ একজন বাংলাদেশি শিক্ষার্থীর কানাডায় এক বছরে আসলে কত খরচ হয়, তা এখানে।",
    blocks: [
      { kind: "table", head: ["খাত", "আনুমানিক (CAD)"], rows: [["Study permit", "$150"], ["Biometrics", "$85"], ["Living (year 1)", "$20,635 → $22,895 (১ সেপ্টে ২০২৬)"], ["GIC (মাসে ফেরত)", "~CAD 1,700–1,900/মাস"], ["Tuition", "college 15k–35k / university 20k–60k"]] },
      { kind: "p", text: "সাশ্রয়ী শহর (Winnipeg, Saskatoon, St. John's) আর কম-tuition public college বেছে নিলে মোট খরচ অনেক কমে।" },
      { kind: "p", text: "EduNomad কখনো ফল নিশ্চয়তা দেয় না।" },
    ],
    faqs: [
      { q: "প্রথম বছরে মোট খরচ কত?", a: "শহর ও institution অনুযায়ী প্রায় CAD 30,000–55,000 (tuition + living + GIC)।" },
      { q: "GIC কি বাড়তি খরচ?", a: "না — এটা আপনারই টাকা, প্রতি মাসে ~CAD 1,700–1,900 করে ফেরত আসে।" },
    ],
  },
  {
    slug: "gic-canada-for-bangladesh-students", locale: "bn",
    title: "বাংলাদেশ থেকে কানাডার GIC (২০২৬): কত, কোন bank, কীভাবে",
    description: "বাংলাদেশি শিক্ষার্থীদের জন্য GIC গাইড — কত (CAD 20,635+), কোন bank, কীভাবে খুলবেন এবং SDS-এর পর এটি কীভাবে study permit-এ কাজে লাগে।",
    intro: "GIC (Guaranteed Investment Certificate) হলো বাংলাদেশি শিক্ষার্থীদের living funds প্রমাণের সবচেয়ে পরিষ্কার উপায়। আবেদনের আগে নির্দিষ্ট পরিমাণ জমা দেন, কানাডায় পৌঁছে প্রতি মাসে ফেরত পান।",
    blocks: [
      { kind: "p", text: `Deposit CAD 20,635 (১ সেপ্টেম্বর ২০২৬ থেকে CAD 22,895); প্রথম বছরে মাসে ~CAD 1,700–1,900 করে ফেরত আসে।` },
      { kind: "h2", text: "যেসব bank-এ খোলা যায়" },
      { kind: "ul", items: ["Scotiabank", "ICICI Bank Canada", "CIBC", "RBC"] },
      { kind: "p", text: "SDS বন্ধ হলেও GIC বাধ্যতামূলক নয়, কিন্তু এটাই সবচেয়ে শক্তিশালী ও দ্রুত-verify হওয়া proof।" },
    ],
    faqs: [
      { q: "GIC কি ফেরতযোগ্য?", a: "এটা আপনারই টাকা — পৌঁছে account চালু করলে মাসে মাসে ফেরত পান। visa refuse হলেও ফেরত পাওয়া যায়।" },
      { q: "এখন কি GIC লাগে?", a: "বাধ্যতামূলক নয়, তবে এটাই সবচেয়ে নির্ভরযোগ্য proof of funds।" },
    ],
  },
  {
    slug: "scholarships-in-canada-for-bangladesh-students", locale: "bn",
    title: "বাংলাদেশি শিক্ষার্থীদের জন্য কানাডায় Scholarship (২০২৬)",
    description: "২০২৬-এ বাংলাদেশি শিক্ষার্থীরা যেসব government, university ও entrance scholarship-এর জন্য চেষ্টা করতে পারেন — পরিমাণ ও আবেদনের কৌশল।",
    intro: "Scholarship সাধারণত পুরো খরচ মেটায় না, কিন্তু সঠিকটি আপনার বিল কমায় এবং visa file শক্ত করে। বাংলাদেশি শিক্ষার্থীরা বাস্তবে যা চেষ্টা করতে পারেন।",
    blocks: [
      { kind: "ul", items: ["Vanier Canada Graduate Scholarships (PhD) — CAD 50,000/বছর × ৩", "Canada Graduate Scholarships – Master's — CAD 27,000", "Lester B. Pearson (U of T) — full", "University entrance scholarship — offer letter-এ থাকে, পড়ে নিন"] },
      { kind: "callout", text: "Scholarship letter proof of funds হিসেবে গ্রহণযোগ্য এবং আপনার দেখাতে হওয়া টাকার পরিমাণ কমায়।" },
    ],
    faqs: [{ q: "বাংলাদেশিদের জন্য fully funded scholarship আছে?", a: "Graduate পর্যায়ে আছে (Vanier, Pearson) — তবে অত্যন্ত প্রতিযোগিতামূলক ও merit-ভিত্তিক।" }],
  },
  {
    slug: "study-in-canada-without-ielts-from-bangladesh", locale: "bn",
    title: "IELTS ছাড়া বাংলাদেশ থেকে কানাডায় পড়া (২০২৬): বাস্তব উপায়",
    description: "IELTS ছাড়া বাংলাদেশি শিক্ষার্থীরা কি কানাডায় যেতে পারে? MOI letter, Duolingo, PTE নিয়ে সৎ উত্তর — এবং কেন study permit-এ test লাগবেই।",
    intro: "\"IELTS ছাড়া\" মানে সাধারণত \"admission-এ IELTS ছাড়া\" — visa-র জন্য কোনো test ছাড়া নয়। বাংলাদেশি শিক্ষার্থীদের জন্য আসলে কী সম্ভব, তা এখানে।",
    blocks: [
      { kind: "ul", items: ["MOI letter (শুধু admission, যেখানে গ্রহণ করে)", "Duolingo English Test — admission offer-এর জন্য", "PTE Academic — পূর্ণ IELTS বিকল্প (admission)"] },
      { kind: "callout", text: "IRCC Duolingo গ্রহণ করে না, আর PGWP-তে IELTS General Training/CELPIP/PTE Core লাগে। admission waive হলেও একটি স্বীকৃত test-এর পরিকল্পনা রাখুন।" },
    ],
    faqs: [{ q: "শুধু Duolingo দিয়ে study permit হয়?", a: "না — IRCC Duolingo নেয় না। admission-এ ব্যবহার করুন, তারপর study permit ও PGWP-এর জন্য IELTS/PTE দিন।" }],
  },
];

// ── Hindi (India) ───────────────────────────────────────────────────────────
const HI: NativeArticle[] = [
  {
    slug: "study-in-canada-from-india", locale: "hi",
    title: "भारत से कनाडा में पढ़ाई (2026): पूरी स्टेप-बाय-स्टेप गाइड",
    description: "भारत से कनाडा पढ़ने जाना चाहते हैं? खर्च, proof of funds और GIC, IELTS, SDS बंद होने के बाद study permit, टॉप universities और PGWP से PR — 2026 की पूरी गाइड।",
    intro: "कनाडा आज भी भारतीय छात्रों की पहली पसंद है — post-study work, साफ़ PR रास्ते और GIC-आधारित visa proof की वजह से। नियम हाल ही में काफ़ी बदले हैं (SDS बंद, funds बढ़े, PGWP में अब language test ज़रूरी), इसलिए यहाँ 2026 के सही कदम दिए गए हैं।",
    blocks: [
      { kind: "h2", text: "मुख्य शर्तें" },
      { kind: "ul", items: [
        "Academics: diploma/bachelor के लिए मान्यता-प्राप्त सर्टिफ़िकेट; master के लिए bachelor डिग्री।",
        "English: आम तौर पर IELTS 6.0–6.5; PTE 50–60; कुछ college admission के लिए Duolingo भी लेते हैं।",
        `पैसा: first-year tuition + ${PF.replace("১ সেপ্টেম্বর ২০২৬ থেকে", "1 सितंबर 2026 से")} living — यानी GIC के लिए लगभग ₹13–15.3 लाख।`,
        "ज़्यादातर भारतीय छात्र education loan + GIC से फंड करते हैं (SBI Global Ed-Vantage सबसे लोकप्रिय)।",
      ] },
      { kind: "h2", text: "Study permit के कदम (SDS के बाद)" },
      { kind: "callout", text: "Student Direct Stream (SDS) 8 नवंबर 2024 को बंद हो गया। अब सभी regular stream से apply करते हैं — processing लगभग 8–12 हफ़्ते।" },
      { kind: "ol", items: ["IELTS/PTE दें", "DLI से Letter of Acceptance लें", "Education loan sanction कराएँ और GIC transfer करें", "IRCC panel physician से medical कराएँ", "Online apply करें और VFS Global पर biometrics दें"] },
      { kind: "h2", text: "PGWP और PR" },
      { kind: "p", text: "PGWP के लिए अब language test ज़रूरी है (university graduates को CLB 7, college को CLB 5)। PGWP से skilled काम (TEER 0/1/2/3) करके लगभग 1 साल में Express Entry/PNP से PR का रास्ता खुलता है।" },
      { kind: "p", text: "EduNomad आपकी पूरी file तैयार करता है, पर admission या visa का फ़ैसला university और IRCC का होता है — हम कभी नतीजे की गारंटी नहीं देते।" },
    ],
    faqs: [
      { q: "क्या 2026 में भारतीय छात्रों के लिए SDS है?", a: "नहीं। SDS 8 नवंबर 2024 को बंद हो गया; अब सभी regular stream से apply करते हैं (लगभग 8–12 हफ़्ते)।" },
      { q: "कनाडा पढ़ने के लिए कितना पैसा दिखाना होता है?", a: `First-year tuition + ${PF.replace("১ সেপ্টেম্বর ২০২৬ থেকে", "1 सितंबर 2026 से")} living — GIC के लिए लगभग ₹13–15.3 लाख।` },
      { q: "क्या IELTS के बिना कनाडा पढ़ सकते हैं?", a: "Admission के लिए कभी-कभी (MOI/Duolingo) — पर study permit और PGWP के लिए IELTS/PTE ज़रूरी है।" },
    ],
  },
  {
    slug: "canada-student-visa-from-india", locale: "hi",
    title: "भारत से कनाडा Student Visa (2026): शर्तें और प्रक्रिया",
    description: "2026 में भारतीय छात्रों की कनाडा study permit की पूरी checklist — documents, proof of funds, biometrics, processing time और refusal से बचने के तरीके।",
    intro: "कनाडा का \"student visa\" असल में study permit है (साथ में travel के लिए visa)। 2026 में भारतीय आवेदक क्या जमा करते हैं और किन ग़लतियों से refusal होता है, यहाँ देखें।",
    blocks: [
      { kind: "h2", text: "ज़रूरी documents" },
      { kind: "ul", items: ["वैध passport", "DLI से Letter of Acceptance", `Proof of funds — ${PF.replace("১ সেপ্টেম্বর ২০২৬ থেকে", "1 सितंबर 2026 से")}`, "GIC certificate / loan sanction letter", "Statement of Purpose (SOP)", "Academic transcripts", "IELTS/PTE result", "Medical और biometrics"] },
      { kind: "callout", text: "IRCC भारतीय financial documents की अतिरिक्त जाँच करता है — कई महीनों के statement और कभी-कभी source of funds का affidavit माँगा जाता है।" },
      { kind: "h2", text: "Refusal के मुख्य कारण" },
      { kind: "ul", items: ["loan sanction जो year-1 tuition + living साफ़ कवर न करे", "apply से ठीक पहले रखा गया पैसा", "immigration जैसा दिखने वाला study plan", "course का past academics/experience से मेल न खाना"] },
      { kind: "p", text: "EduNomad कभी visa नतीजे की गारंटी नहीं देता।" },
    ],
    faqs: [
      { q: "भारतीय छात्र biometrics कहाँ देते हैं?", a: "VFS Global (Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata, Chandigarh आदि)।" },
      { q: "Visa fee कितनी है?", a: "Study permit CAD 150 + biometrics CAD 85।" },
    ],
  },
  {
    slug: "gic-canada-for-india-students", locale: "hi",
    title: "भारत से कनाडा GIC (2026): राशि, Banks और कैसे खोलें",
    description: "भारतीय छात्रों के लिए GIC गाइड — कितना (CAD 20,635+ / ~₹13–15.3 लाख), कौन-से bank (SBI/ICICI/Scotiabank), कैसे खोलें और SDS के बाद यह कैसे काम आता है।",
    intro: "GIC living funds दिखाने का सबसे साफ़ तरीका है। apply से पहले तय राशि जमा करते हैं; कनाडा पहुँचने पर हर महीने वापस मिलती है।",
    blocks: [
      { kind: "p", text: "Deposit CAD 20,635 (1 सितंबर 2026 से CAD 22,895) — लगभग ₹13–15.3 लाख; पहले साल हर महीने ~CAD 1,700–1,900 वापस।" },
      { kind: "h2", text: "Eligible banks" },
      { kind: "ul", items: ["Scotiabank", "ICICI Bank Canada", "SBI Canada", "CIBC"] },
      { kind: "p", text: "कई lenders (जैसे SBI Global Ed-Vantage) GIC की राशि सीधे approved Canadian bank को भेज देते हैं।" },
    ],
    faqs: [
      { q: "क्या GIC refundable है?", a: "यह आपका ही पैसा है — पहुँचकर account चालू करने पर हर महीने वापस मिलता है; visa refuse होने पर भी refund मिलता है।" },
      { q: "कौन-से bank भारतीय इस्तेमाल करते हैं?", a: "Scotiabank, ICICI Canada, SBI Canada, CIBC।" },
    ],
  },
  {
    slug: "education-loan-for-canada-from-india", locale: "hi",
    title: "भारत से कनाडा के लिए Education Loan (2026): Banks और टिप्स",
    description: "2026 में भारतीय छात्र कनाडा के लिए education loan से फंडिंग कैसे करें — SBI Global Ed-Vantage, ब्याज दरें, और IRCC क्या देखना चाहता है।",
    intro: "Sanctioned loan जो year-1 tuition और living साफ़ कवर करे, मज़बूत proof of funds है। भारतीय छात्र इसे कैसे structure करें, यहाँ देखें।",
    blocks: [
      { kind: "p", text: "SBI Global Ed-Vantage बाज़ार में अग्रणी है — लगभग 8.5%–10.15% ब्याज, ₹1.5 करोड़ तक, tuition + GIC + living + airfare + insurance कवर। HDFC Credila, Avanse, Bank of Baroda भी विकल्प हैं।" },
      { kind: "callout", text: "IRCC को ऐसा sanction letter चाहिए जो tuition + living स्पष्ट रूप से कवर करे; अस्पष्ट/आंशिक loan file कमज़ोर करता है।" },
    ],
    faqs: [
      { q: "क्या loan proof of funds माना जाता है?", a: "हाँ — year-1 tuition और living कवर करने वाला sanctioned loan व्यापक रूप से स्वीकार्य है।" },
      { q: "क्या loan से GIC फंड हो सकता है?", a: "अक्सर हाँ — कई lenders GIC राशि सीधे approved Canadian bank को भेजते हैं।" },
    ],
  },
  {
    slug: "1-year-masters-in-canada-for-india-students", locale: "hi",
    title: "भारत से कनाडा में 1-Year Master's (2026): PR का तेज़ रास्ता",
    description: "भारतीय छात्रों के लिए 1-year master's क्यों 2026 का सबसे अच्छा PR दांव है — 3-year PGWP, PAL व cap से छूट, और 135 CRS points।",
    intro: "PR के लक्ष्य वाले भारतीय छात्रों के लिए 1-year master's सबसे अच्छा 2026 रास्ता है। Master's graduates को 2 साल से कम कोर्स पर भी 3-year PGWP मिलता है, और public-DLI master's छात्र PAL व study-permit cap से मुक्त हैं।",
    blocks: [
      { kind: "callout", text: "Public university में master's: न PAL, न cap; 3-year PGWP; Express Entry में +135 CRS points।" },
      { kind: "ul", items: ["कुल खर्च 2-साल वाले रास्ते से कम", "तेज़ी से Canadian work experience", "साफ़ PGWP → CEC/PNP रास्ता"] },
      { kind: "p", text: "EduNomad कभी नतीजे की गारंटी नहीं देता।" },
    ],
    faqs: [{ q: "क्या 1-year master's के बाद PR मिल सकता है?", a: "PGWP से 1 साल skilled काम (TEER 0/1/2/3) के बाद Express Entry/PNP से — master's +135 CRS और 3-year PGWP देता है।" }],
  },
  {
    slug: "study-in-canada-without-ielts-from-india", locale: "hi",
    title: "IELTS के बिना भारत से कनाडा पढ़ाई (2026): असली विकल्प",
    description: "क्या भारतीय छात्र IELTS के बिना कनाडा जा सकते हैं? MOI letter, Duolingo, PTE पर सच्चे जवाब — और क्यों study permit के लिए test ज़रूरी है।",
    intro: "\"IELTS के बिना\" का मतलब आम तौर पर \"admission के लिए IELTS के बिना\" है — visa के लिए बिना किसी test के नहीं। भारतीय छात्रों के लिए वास्तव में क्या संभव है, यहाँ देखें।",
    blocks: [
      { kind: "ul", items: ["MOI letter (सिर्फ़ admission, जहाँ स्वीकार हो)", "Duolingo English Test — admission offer के लिए", "PTE Academic — पूरा IELTS विकल्प (admission)"] },
      { kind: "callout", text: "IRCC Duolingo स्वीकार नहीं करता, और PGWP के लिए IELTS General Training/CELPIP/PTE Core चाहिए। admission waive हो तो भी एक मान्य test की योजना रखें।" },
    ],
    faqs: [{ q: "क्या सिर्फ़ Duolingo से study permit मिलता है?", a: "नहीं — IRCC Duolingo नहीं लेता। admission के लिए इस्तेमाल करें, फिर study permit और PGWP के लिए IELTS/PTE दें।" }],
  },
];

// ── Nepali (Nepal) ──────────────────────────────────────────────────────────
const NE: NativeArticle[] = [
  {
    slug: "study-in-canada-from-nepal", locale: "ne",
    title: "नेपालबाट क्यानाडामा अध्ययन (२०२६): पूर्ण चरणबद्ध गाइड",
    description: "नेपालबाट क्यानाडा पढ्न जाने योजना? खर्च, proof of funds र GIC, IELTS, NOC, SDS बन्द भएपछिको study permit, राम्रा university र PGWP देखि PR सम्म — २०२६ को पूर्ण गाइड।",
    intro: "क्यानाडा नेपाली विद्यार्थीहरूको सबैभन्दा रोजाइको गन्तव्य हो — post-study work, स्पष्ट PR बाटो र GIC-आधारित visa proof का कारण। नियमहरू हालसालै धेरै परिवर्तन भएका छन् (SDS बन्द, funds बढ्यो, PGWP मा अब language test अनिवार्य), त्यसैले यहाँ २०२६ का सही चरणहरू दिइएको छ।",
    blocks: [
      { kind: "h2", text: "मुख्य शर्तहरू" },
      { kind: "ul", items: [
        "Academics: +2 मा सामान्यतया ६०%+ (UG का लागि) वा bachelor (PG का लागि)।",
        "English: सामान्यतया IELTS 6.5 (कुनै band 6.0 भन्दा कम होइन); TOEFL 88+ वा PTE 60+ पनि मान्य।",
        `पैसा: first-year tuition + ${PF.replace("১ সেপ্টেম্বর ২০২৬ থেকে", "१ सेप्टेम्बर २०२६ देखि")} living।`,
        "NOC: शिक्षा मन्त्रालय (MoEST) portal बाट NOC अनिवार्य — करिब NPR 2,000, ३–५ कार्यदिनमा; विदेश पैसा पठाउनुअघि चाहिन्छ।",
      ] },
      { kind: "h2", text: "Study permit का चरण (SDS पछि)" },
      { kind: "callout", text: "Student Direct Stream (SDS) ८ नोभेम्बर २०२४ मा बन्द भयो। अब सबैले regular stream बाट apply गर्छन् — processing करिब ८–१२ हप्ता।" },
      { kind: "ol", items: ["MoEST portal बाट NOC लिनुहोस्", "IELTS/PTE/TOEFL दिनुहोस्", "DLI बाट Letter of Acceptance लिनुहोस्", "GIC खोल्नुहोस् र tuition deposit तिर्नुहोस् (NOC पछि)", "Medical गर्नुहोस्, online apply गर्नुहोस्, VFS Global Kathmandu मा biometrics दिनुहोस्"] },
      { kind: "h2", text: "PGWP र PR" },
      { kind: "p", text: "PGWP का लागि अब language test अनिवार्य छ (university graduate लाई CLB 7, college लाई CLB 5)। PGWP बाट skilled काम (TEER 0/1/2/3) गरेर करिब १ वर्षमा Express Entry/PNP मार्फत PR को बाटो खुल्छ।" },
      { kind: "p", text: "EduNomad ले तपाईंको पूरै file मिलाउँछ, तर admission वा visa को निर्णय university र IRCC को हो — हामी कहिल्यै नतिजाको ग्यारेन्टी दिँदैनौं।" },
    ],
    faqs: [
      { q: "के २०२६ मा नेपालीहरूका लागि SDS छ?", a: "छैन। SDS ८ नोभेम्बर २०२४ मा बन्द भयो; अब सबैले regular stream बाट apply गर्छन् (करिब ८–१२ हप्ता)।" },
      { q: "NOC के हो र किन चाहिन्छ?", a: "MoEST portal बाट लिइने No Objection Certificate — करिब NPR 2,000, ३–५ कार्यदिन। विदेश tuition/GIC पठाउन र visa का लागि अनिवार्य।" },
      { q: "के IELTS बिना क्यानाडा पढ्न सकिन्छ?", a: "Admission का लागि कहिलेकाहीँ (MOI/Duolingo) — तर study permit र PGWP का लागि IELTS/PTE चाहिन्छ।" },
    ],
  },
  {
    slug: "canada-student-visa-from-nepal", locale: "ne",
    title: "नेपालबाट क्यानाडा Student Visa (२०२६): शर्त र प्रक्रिया",
    description: "२०२६ मा नेपाली विद्यार्थीका लागि क्यानाडा study permit को पूर्ण checklist — documents, NOC, proof of funds, biometrics र refusal बाट बच्ने उपाय।",
    intro: "क्यानाडाको \"student visa\" वास्तवमा study permit हो (travel का लागि visa सहित)। २०२६ मा नेपाली आवेदकले के बुझाउँछन् र कुन गल्तीले refusal हुन्छ, यहाँ हेर्नुहोस्।",
    blocks: [
      { kind: "h2", text: "आवश्यक documents" },
      { kind: "ul", items: ["वैध passport", "DLI बाट Letter of Acceptance", "NOC (MoEST)", `Proof of funds — ${PF.replace("১ সেপ্টেম্বর ২০২৬ থেকে", "१ सेप्टेम्बर २०२६ देखि")}`, "GIC certificate / tuition receipt", "SOP", "Academic transcript", "IELTS/PTE/TOEFL", "Medical र biometrics"] },
      { kind: "callout", text: "धेरै college/undergraduate आवेदकलाई PAL/TAL चाहिन्छ; public DLI मा master/PhD सुरु गरे १ जनवरी २०२६ देखि PAL चाहिँदैन।" },
      { kind: "h2", text: "Refusal का मुख्य कारण" },
      { kind: "ul", items: ["NOC मिलेन वा विवरण नमिल्नु", "स्रोत प्रस्ट नभएको पैसा", "course सँग नमिल्ने study plan", "academic gap अव्याख्यात"] },
      { kind: "p", text: "EduNomad ले कहिल्यै visa नतिजाको ग्यारेन्टी दिँदैन।" },
    ],
    faqs: [
      { q: "नेपालीहरू biometrics कहाँ दिन्छन्?", a: "VFS Global, Kathmandu मा।" },
      { q: "Visa fee कति हो?", a: "Study permit CAD 150 + biometrics CAD 85।" },
    ],
  },
  {
    slug: "gic-canada-for-nepal-students", locale: "ne",
    title: "नेपालबाट क्यानाडा GIC (२०२६): रकम, Bank र कसरी खोल्ने",
    description: "नेपाली विद्यार्थीका लागि GIC गाइड — कति (CAD 20,635+), कुन bank, NOC सँग कसरी मिलाउने, र SDS पछि यो कसरी काम लाग्छ।",
    intro: "GIC living funds देखाउने सबैभन्दा सफा तरिका हो। apply अघि तोकिएको रकम जम्मा गर्नुहुन्छ; क्यानाडा पुगेपछि हरेक महिना फिर्ता पाउनुहुन्छ।",
    blocks: [
      { kind: "p", text: "Deposit CAD 20,635 (१ सेप्टेम्बर २०२६ देखि CAD 22,895); पहिलो वर्ष महिनामा ~CAD 1,700–1,900 फिर्ता।" },
      { kind: "callout", text: "नेपालबाट GIC का लागि पैसा पठाउनुअघि NOC चाहिन्छ — समयतालिकामा यो जोड्नुहोस्।" },
      { kind: "ul", items: ["Scotiabank", "ICICI Bank Canada", "CIBC", "RBC"] },
    ],
    faqs: [{ q: "के GIC फिर्ता हुन्छ?", a: "यो तपाईंकै पैसा हो — पुगेर account सक्रिय गरेपछि महिनामा फिर्ता; visa refuse भए पनि refund पाइन्छ।" }],
  },
  {
    slug: "ielts-requirements-for-canada-from-nepal", locale: "ne",
    title: "नेपालबाट क्यानाडाका लागि IELTS आवश्यकता (२०२६)",
    description: "नेपाली विद्यार्थीलाई क्यानाडा admission र study permit का लागि कति IELTS band चाहिन्छ, PTE/TOEFL/Duolingo/MOI विकल्प, र PGWP language नियम।",
    intro: "सामान्यतया IELTS 6.5 (कुनै band 6.0 भन्दा कम होइन) नै लक्ष्य हो — तर कुन test कुन चरणका लागि भन्ने महत्त्वपूर्ण छ।",
    blocks: [
      { kind: "p", text: "Admission: धेरै programme ले IELTS/PTE/TOEFL लिन्छन्; केहीले MOI/Duolingo पनि (admission मात्र)।" },
      { kind: "callout", text: "PGWP का लागि IELTS General Training/CELPIP/PTE Core चाहिन्छ — IELTS Academic मान्य छैन।" },
    ],
    faqs: [{ q: "नेपालीलाई क्यानाडाका लागि कति IELTS चाहिन्छ?", a: "सामान्यतया 6.5 (कुनै band 6.0 भन्दा कम होइन); TOEFL 88+ वा PTE 60+ पनि मान्य।" }],
  },
  {
    slug: "study-in-canada-without-ielts-from-nepal", locale: "ne",
    title: "IELTS बिना नेपालबाट क्यानाडा अध्ययन (२०२६): वास्तविक विकल्प",
    description: "के नेपाली विद्यार्थी IELTS बिना क्यानाडा जान सक्छन्? MOI letter, Duolingo, PTE मा सत्य जवाफ — र किन study permit का लागि test चाहिन्छ।",
    intro: "\"IELTS बिना\" को अर्थ सामान्यतया \"admission का लागि IELTS बिना\" हो — visa का लागि कुनै test बिना होइन। नेपाली विद्यार्थीका लागि वास्तवमा के सम्भव छ, यहाँ हेर्नुहोस्।",
    blocks: [
      { kind: "ul", items: ["MOI letter (admission मात्र, जहाँ स्वीकार हुन्छ)", "Duolingo English Test — admission offer का लागि", "PTE Academic — पूरा IELTS विकल्प (admission)"] },
      { kind: "callout", text: "IRCC ले Duolingo स्वीकार गर्दैन, र PGWP का लागि IELTS General Training/CELPIP/PTE Core चाहिन्छ।" },
    ],
    faqs: [{ q: "के केवल Duolingo ले study permit हुन्छ?", a: "हुँदैन — IRCC ले Duolingo लिँदैन। admission का लागि प्रयोग गर्नुहोस्, त्यसपछि study permit र PGWP का लागि IELTS/PTE दिनुहोस्।" }],
  },
  {
    slug: "scholarships-in-canada-for-nepal-students", locale: "ne",
    title: "नेपाली विद्यार्थीका लागि क्यानाडामा Scholarship (२०२६)",
    description: "२०२६ मा नेपाली विद्यार्थीले प्रयास गर्न सक्ने government, university र entrance scholarship — रकम र आवेदन रणनीति।",
    intro: "Scholarship ले सामान्यतया पूरै खर्च धान्दैन, तर सही scholarship ले बिल घटाउँछ र visa file बलियो बनाउँछ। नेपाली विद्यार्थीले वास्तवमा के प्रयास गर्न सक्छन्।",
    blocks: [
      { kind: "ul", items: ["Vanier Canada Graduate Scholarships (PhD) — CAD 50,000/वर्ष × ३", "Canada Graduate Scholarships – Master's — CAD 27,000", "Lester B. Pearson (U of T) — full", "University entrance scholarship — offer letter मा हेर्नुहोस्"] },
      { kind: "callout", text: "Scholarship letter proof of funds का रूपमा मान्य हुन्छ र देखाउनुपर्ने रकम घटाउँछ।" },
    ],
    faqs: [{ q: "के नेपालीका लागि fully funded scholarship छ?", a: "Graduate तहमा छ (Vanier, Pearson) — तर अत्यन्त प्रतिस्पर्धात्मक र merit-आधारित।" }],
  },
];

const ALL_NATIVE: NativeArticle[] = [...BN, ...HI, ...NE];

export const NATIVE_BY_KEY: Map<string, NativeArticle> = new Map(ALL_NATIVE.map((a) => [`${a.locale}:${a.slug}`, a]));
export const NATIVE_BY_LOCALE: Record<NativeLocale, NativeArticle[]> = {
  bn: BN, hi: HI, ne: NE,
};
export function nativeArticle(locale: string, slug: string): NativeArticle | undefined {
  return NATIVE_BY_KEY.get(`${locale}:${slug}`);
}
export function nativeLocalesForSlug(slug: string): NativeLocale[] {
  return NATIVE_LOCALES.filter((l) => NATIVE_BY_KEY.has(`${l}:${slug}`));
}
export const NATIVE_COUNT = ALL_NATIVE.length;
