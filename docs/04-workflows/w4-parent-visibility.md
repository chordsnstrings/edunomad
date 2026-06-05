# Workflow 4 — Parent visibility and financial approval

| Attribute | Value |
|---|---|
| Actors | Parent (primary), Student (initiator), Counsellor (mediator), Finance (executor) |
| Trigger | Student invites parent during onboarding |
| Outcome | Parent has visibility throughout the journey; payments approved through parent's flow |
| Duration | Whole student journey |
| Languages | Default to source-country language (BN/HI/NE), EN override available |

## Step-by-step

### 1. Invitation
Student taps "Invite parent" → enters parent's WhatsApp number → system sends WhatsApp: "Your son/daughter [Name] has invited you to follow their EduNomad application. Tap here to set up your view." Link opens parent setup page; parent enters PIN, verifies via OTP, lands on student's status page.

### 2. Status dashboard
Single screen showing:
- Student name + photo + current stage
- Application timeline (9 stages) with current stage highlighted
- Activity feed (parent-visible events only) most recent first
- Upcoming actions (payments due, decisions expected)
- Counsellor name + photo + WhatsApp button
- "Message counsellor" button

Default locale = source-country language. Language toggle prominent. Large fonts, simple navigation.

### 3. Receive nudges
Per event policy, parent receives WhatsApp on milestones: application submitted; conditional offer; unconditional offer; tuition deposit due; GIC initiated; visa appointment booked; visa decision. Daily 18:00 WhatsApp digest summarising the day's milestones.

### 4. Payment approval
Fee or tuition deposit due → parent receives WhatsApp + push. Tap → approval modal:
- What the payment is for
- Amount in BDT/INR/NPR + currency conversion shown
- Where the money goes (EduNomad service fee, tuition deposit to [University], GIC to [Bank])
- Refund policy summary
- Payment options (bKash, Nagad, SSL, card, bank transfer)
- "Approve & pay" button

Two-tap approval. Receipt appears in dashboard.

### 5. Question to counsellor
Parent taps "Message counsellor." In-app chat; messages auto-translate to/from counsellor's language if different.

### 6. Escalation to manager
"Talk to a manager" button visible from any screen. Routes directly to Counsellor Manager. SLA: 4 working hours.
