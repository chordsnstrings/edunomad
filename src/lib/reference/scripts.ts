// AUTO-GENERATED from docs/05-reference/counsellor-scripts.md
// Run: node scripts/build-scripts.mjs
export const INTRO_SCRIPT = "Hi [Student Name], this is [Counsellor Name] from EduNomad. Thanks for filling out your profile — I have it open in front of me. I'm going to spend the next 20–25 minutes understanding what you're looking for, walking you through which universities and intakes might fit, and answering any questions. Is now a good time, or should we move it? If your parents are around and want to listen in, that's welcome — most students do that. Before we start, can I confirm one thing — your intake target is [Sept 2026], right?";
export const QUALIFICATION_QUESTIONS: string[] = [
  "What is your highest qualification, and which board / institution?",
  "What was your overall percentage / GPA / CGPA?",
  "Have you taken IELTS / Duolingo / PTE? If yes, score; if not, when can you?",
  "Why this destination / which destinations are you open to?",
  "What field or programme are you most drawn to, and why?",
  "Who is funding your education, and what is their occupation / business?",
  "What is the budget your family is comfortable with for tuition + first year living?",
  "Have you or any close family member previously applied for a visa anywhere? Outcome?",
  "When do you want to start — earliest viable intake?",
  "What are you most uncertain about right now?"
];
export type Objection = { id: string; headline: string; response: string; keywords: string[] };
export const OBJECTIONS: Objection[] = [
  {
    "id": "why_should_we_use_you_instead_of_competi",
    "headline": "Why should we use you instead of [competitor / local agent]?",
    "response": "Three reasons. First, every step is visible to you and your parents in the app — no chasing for updates. Second, every visa file is signed off by a registered consultant (RCIC for Canada / MARA for Australia / OISC for UK paid advice). That's a regulatory requirement most local agents skip. Third, our partner universities are listed publicly; you can verify everything we say, in writing.",
    "keywords": [
      "competitor",
      "local",
      "agent"
    ]
  },
  {
    "id": "can_you_guarantee_a_visa",
    "headline": "Can you guarantee a visa?",
    "response": "No one can. What we can do is make sure your file is complete, accurate, and consistent with what visa officers look for. Approval rates for properly-prepared files are very different from improvised ones. I cannot promise approval and I won't pretend otherwise — that's the rule we work by.",
    "keywords": [
      "guarantee",
      "visa"
    ]
  },
  {
    "id": "can_you_get_me_a_scholarship",
    "headline": "Can you get me a scholarship?",
    "response": "Some universities offer entrance scholarships at specific GPA bands. I'll show you which ones you qualify for. I won't promise anything I can't deliver — most scholarships are competitive, partial, and conditional on your final transcript.",
    "keywords": [
      "scholarship"
    ]
  },
  {
    "id": "why_is_your_fee_higher_than_competitor",
    "headline": "Why is your fee higher than [competitor]?",
    "response": "Two things. First, our fee includes services they don't usually include — SOP polishing, document QA, post-arrival check-ins. Second, what looks cheap upfront sometimes costs more in rework, missed deadlines, or visa refusals. Let me walk you through exactly what each component covers — you decide whether the difference is worth it.",
    "keywords": [
      "your",
      "fee",
      "higher",
      "than",
      "competitor"
    ]
  },
  {
    "id": "what_if_the_visa_is_refused",
    "headline": "What if the visa is refused?",
    "response": "We have a refund policy that covers part of the fee in specific scenarios. Let me share the policy in writing so you and your parents can read it together. Refusals are uncommon for well-prepared files but not impossible.",
    "keywords": [
      "visa",
      "refused"
    ]
  },
  {
    "id": "my_gpa_is_low_can_i_still_go",
    "headline": "My GPA is low. Can I still go?",
    "response": "Yes, depending on the destination. Foundation programmes, diploma pathways, and certain universities accept lower academic profiles. Australia and Malaysia have more flexible options at lower percentages than Canada or the UK. Let me show you which ones realistically fit.",
    "keywords": [
      "gpa",
      "low"
    ]
  },
  {
    "id": "can_i_work_while_studying",
    "headline": "Can I work while studying?",
    "response": "In most destinations, yes — usually 20 hours a week during term and full-time during breaks. The rules differ by country. But please budget assuming part-time work doesn't fully cover your living costs — visa officers expect funds independent of work.",
    "keywords": [
      "work",
      "while",
      "studying"
    ]
  },
  {
    "id": "will_i_get_pr_settle_there_after_studyin",
    "headline": "Will I get PR / settle there after studying?",
    "response": "It depends on the country, the programme, and your post-study choices. I can't promise PR. I can show you which programmes have post-study work visas, and the typical pathways from there. Canada has Express Entry, UK has skilled worker routes, Australia has skilled migration — but rules change.",
    "keywords": [
      "will",
      "settle",
      "there",
      "after",
      "studying"
    ]
  },
  {
    "id": "why_gic_for_canada_can_i_show_my_dad_s_b",
    "headline": "Why GIC for Canada? Can I show my dad's bank balance instead?",
    "response": "For Canada, the CAD 22,895 financial proof is strongly preferred via GIC. Other proof is technically possible but the bar to convince the visa officer is much higher. Most successful BD/IN/NP files use GIC.",
    "keywords": [
      "gic",
      "canada",
      "show",
      "dad",
      "bank",
      "balance"
    ]
  },
  {
    "id": "can_i_switch_destination_later",
    "headline": "Can I switch destination later?",
    "response": "Yes, but it usually means redoing the application package. Some refund of original fees may apply per our policy. I'd rather we talk through what's making you reconsider, before we change direction.",
    "keywords": [
      "switch",
      "destination",
      "later"
    ]
  },
  {
    "id": "my_english_is_weak_can_i_still_apply",
    "headline": "My English is weak. Can I still apply?",
    "response": "There are pathways. MOI letters, Duolingo (faster than IELTS), or foundation pathways with embedded English support. Let me show you which work for your child.",
    "keywords": [
      "english",
      "weak",
      "apply"
    ]
  },
  {
    "id": "can_i_apply_without_ielts",
    "headline": "Can I apply without IELTS?",
    "response": "Yes, sometimes. MOI letters, Duolingo, PTE, or specific university waivers are options.",
    "keywords": [
      "apply",
      "ielts"
    ]
  },
  {
    "id": "my_family_can_t_show_enough_funds",
    "headline": "My family can't show enough funds.",
    "response": "Education loan options through our partner banks. Or lower-cost destinations — Malaysia, certain Canadian colleges. Let me show you what is realistic for your situation.",
    "keywords": [
      "family",
      "show",
      "enough",
      "funds"
    ]
  },
  {
    "id": "how_long_does_the_visa_take",
    "headline": "How long does the visa take?",
    "response": "Canada 8–16 weeks; UK 3–6; Australia 4–16; Malaysia 4–8. I'll give you specific intake-deadline planning once we lock your destination.",
    "keywords": [
      "visa"
    ]
  },
  {
    "id": "can_i_go_without_my_parents_knowing",
    "headline": "Can I go without my parents knowing?",
    "response": "If you're an adult, technically yes. But visa officers often look for family awareness, and the financial side is usually easier with family backing. I can help structure the conversation if it would help.",
    "keywords": [
      "parents",
      "knowing"
    ]
  }
];
export type ComplianceGuard = { id: string; name: string; keywords: string[]; modalText: string };
export const COMPLIANCE_GUARDS: ComplianceGuard[] = [
  {
    "id": "visa_guarantee",
    "name": "Visa guarantee",
    "keywords": [
      "I guarantee",
      "100% visa",
      "definitely get visa",
      "sure to get visa"
    ],
    "modalText": "⚠ The phrase you used could be interpreted as a visa guarantee. Per Compliance policy, no role can guarantee a visa. Please rephrase. If you continue, this will be flagged for Counsellor Manager review."
  },
  {
    "id": "pr_promise",
    "name": "PR promise",
    "keywords": [
      "I'll get you PR",
      "guaranteed PR",
      "sure to settle"
    ],
    "modalText": "⚠ PR pathways depend on factors outside our control. Please rephrase. If you continue, this will be flagged."
  },
  {
    "id": "off_platform_payment",
    "name": "Off-platform payment",
    "keywords": [
      "pay me directly",
      "send to my bKash",
      "outside the app",
      "personal account"
    ],
    "modalText": "⚠ Off-platform payments are zero-tolerance. This message will be flagged immediately to Counsellor Manager and Education Manager."
  }
];
