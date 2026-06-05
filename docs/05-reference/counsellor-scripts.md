# Counsellor scripts (block-typed)

Surfaced contextually inside Counsellor dashboard (dialer panel, chat panel, lead detail). Each block has a trigger condition.

## 60-second intro script

**Trigger:** `call_started AND first_call_with_student`
**Surface:** dialer right rail

> "Hi [Student Name], this is [Counsellor Name] from EduNomad. Thanks for filling out your profile — I have it open in front of me. I'm going to spend the next 20–25 minutes understanding what you're looking for, walking you through which universities and intakes might fit, and answering any questions. Is now a good time, or should we move it? If your parents are around and want to listen in, that's welcome — most students do that. Before we start, can I confirm one thing — your intake target is [Sept 2026], right?"

## 10 qualification questions

**Trigger:** `discovery_call_in_progress`
**Surface:** dialer right rail (checklist block)

1. What is your highest qualification, and which board / institution?
2. What was your overall percentage / GPA / CGPA?
3. Have you taken IELTS / Duolingo / PTE? If yes, score; if not, when can you?
4. Why this destination / which destinations are you open to?
5. What field or programme are you most drawn to, and why?
6. Who is funding your education, and what is their occupation / business?
7. What is the budget your family is comfortable with for tuition + first year living?
8. Have you or any close family member previously applied for a visa anywhere? Outcome?
9. When do you want to start — earliest viable intake?
10. What are you most uncertain about right now?

## 15 objections and responses

**Trigger:** keyword detection on call/chat
**Surface:** dialer searchable panel

### Why should we use you instead of [competitor / local agent]?
> "Three reasons. First, every step is visible to you and your parents in the app — no chasing for updates. Second, every visa file is signed off by a registered consultant (RCIC for Canada / MARA for Australia / OISC for UK paid advice). That's a regulatory requirement most local agents skip. Third, our partner universities are listed publicly; you can verify everything we say, in writing."

### Can you guarantee a visa?
> "No one can. What we can do is make sure your file is complete, accurate, and consistent with what visa officers look for. Approval rates for properly-prepared files are very different from improvised ones. I cannot promise approval and I won't pretend otherwise — that's the rule we work by."

### Can you get me a scholarship?
> "Some universities offer entrance scholarships at specific GPA bands. I'll show you which ones you qualify for. I won't promise anything I can't deliver — most scholarships are competitive, partial, and conditional on your final transcript."

### Why is your fee higher than [competitor]?
> "Two things. First, our fee includes services they don't usually include — SOP polishing, document QA, post-arrival check-ins. Second, what looks cheap upfront sometimes costs more in rework, missed deadlines, or visa refusals. Let me walk you through exactly what each component covers — you decide whether the difference is worth it."

### What if the visa is refused?
> "We have a refund policy that covers part of the fee in specific scenarios. Let me share the policy in writing so you and your parents can read it together. Refusals are uncommon for well-prepared files but not impossible."

### My GPA is low. Can I still go?
> "Yes, depending on the destination. Foundation programmes, diploma pathways, and certain universities accept lower academic profiles. Australia and Malaysia have more flexible options at lower percentages than Canada or the UK. Let me show you which ones realistically fit."

### Can I work while studying?
> "In most destinations, yes — usually 20 hours a week during term and full-time during breaks. The rules differ by country. But please budget assuming part-time work doesn't fully cover your living costs — visa officers expect funds independent of work."

### Will I get PR / settle there after studying?
> "It depends on the country, the programme, and your post-study choices. I can't promise PR. I can show you which programmes have post-study work visas, and the typical pathways from there. Canada has Express Entry, UK has skilled worker routes, Australia has skilled migration — but rules change."

### Why GIC for Canada? Can I show my dad's bank balance instead?
> "For Canada, the CAD 22,895 financial proof is strongly preferred via GIC. Other proof is technically possible but the bar to convince the visa officer is much higher. Most successful BD/IN/NP files use GIC."

### Can I switch destination later?
> "Yes, but it usually means redoing the application package. Some refund of original fees may apply per our policy. I'd rather we talk through what's making you reconsider, before we change direction."

### My English is weak. Can I still apply?
> "There are pathways. MOI letters, Duolingo (faster than IELTS), or foundation pathways with embedded English support. Let me show you which work for your child."

### Can I apply without IELTS?
> "Yes, sometimes. MOI letters, Duolingo, PTE, or specific university waivers are options."

### My family can't show enough funds.
> "Education loan options through our partner banks. Or lower-cost destinations — Malaysia, certain Canadian colleges. Let me show you what is realistic for your situation."

### How long does the visa take?
> "Canada 8–16 weeks; UK 3–6; Australia 4–16; Malaysia 4–8. I'll give you specific intake-deadline planning once we lock your destination."

### Can I go without my parents knowing?
> "If you're an adult, technically yes. But visa officers often look for family awareness, and the financial side is usually easier with family backing. I can help structure the conversation if it would help."

## Compliance keyword guards

**Trigger:** real-time keyword match on counsellor message being composed
**Surface:** real-time modal that blocks send

Three guards (each modal logs the attempt regardless of whether counsellor proceeds):

### Visa guarantee
Keywords: "I guarantee", "100% visa", "definitely get visa", "sure to get visa"
Modal text: "⚠ The phrase you used could be interpreted as a visa guarantee. Per Compliance policy, no role can guarantee a visa. Please rephrase. If you continue, this will be flagged for Counsellor Manager review."

### PR promise
Keywords: "I'll get you PR", "guaranteed PR", "sure to settle"
Modal text: "⚠ PR pathways depend on factors outside our control. Please rephrase. If you continue, this will be flagged."

### Off-platform payment
Keywords: "pay me directly", "send to my bKash", "outside the app", "personal account"
Modal text: "⚠ Off-platform payments are zero-tolerance. This message will be flagged immediately to Counsellor Manager and Education Manager."

## Close-the-call summary template

**Trigger:** call ended
**Surface:** chat panel one-tap insert

```
Hi {{student_first_name}}, thanks for your time today. Quick recap so we're aligned:

Destination: {{destination}}
Intake: {{intake}}
Budget: {{budget_range}}

Next from your side:
{{next_steps_student}}

Next from my side:
{{next_steps_counsellor}}

Our next call: {{next_call_datetime}}.

Save my number, WhatsApp me anytime.

— {{counsellor_name}}
```
