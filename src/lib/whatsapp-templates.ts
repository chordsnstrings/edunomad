// AUTO-GENERATED from docs/05-reference/whatsapp-templates.md
// Run: node scripts/build-whatsapp-templates.mjs
export type WhatsAppTemplate = {
  id: string;
  category: string;
  body: string;
  variables: number;
};

export const WHATSAPP_TEMPLATES: Record<string, WhatsAppTemplate> = {
  "counsellor_assigned": {
    "id": "counsellor_assigned",
    "category": "utility",
    "body": "Hi {{1}}, your EduNomad counsellor is {{2}}. They will message you within 4 working hours to schedule a call. Save this number.",
    "variables": 2
  },
  "counsellor_message_summary": {
    "id": "counsellor_message_summary",
    "category": "utility",
    "body": "{{1}} from EduNomad: {{2}}",
    "variables": 2
  },
  "call_scheduled": {
    "id": "call_scheduled",
    "category": "utility",
    "body": "Your call with your EduNomad counsellor is scheduled for {{1}}. Please be ready 5 minutes before. Reply RESCHEDULE to change.",
    "variables": 1
  },
  "doc_request": {
    "id": "doc_request",
    "category": "utility",
    "body": "Hi! Please upload your {{1}} on the EduNomad app. Tap the link in the app to start. Thanks!",
    "variables": 1
  },
  "doc_rework": {
    "id": "doc_rework",
    "category": "utility",
    "body": "Hi, your {{1}} needs a small fix: {{2}}. Please re-upload on the app. We'll review within 24 hours.",
    "variables": 2
  },
  "shortlist_locked": {
    "id": "shortlist_locked",
    "category": "utility",
    "body": "Hi {{1}}, your shortlist of {{2}} programmes is locked. Our Operations team is now packaging your applications. We'll update you at every step.",
    "variables": 2
  },
  "app_submitted": {
    "id": "app_submitted",
    "category": "utility",
    "body": "Hi {{1}}, your application to {{2}} has been submitted today. We'll let you know when they get back to us.",
    "variables": 2
  },
  "app_info_requested": {
    "id": "app_info_requested",
    "category": "utility",
    "body": "{{1}} has requested additional information for your application. Open the app to see what they need. Your counsellor will help.",
    "variables": 1
  },
  "offer_conditional": {
    "id": "offer_conditional",
    "category": "utility",
    "body": "Good news — conditional offer from {{1}}! Open the app to see the conditions and next steps.",
    "variables": 1
  },
  "offer_unconditional": {
    "id": "offer_unconditional",
    "category": "utility",
    "body": "Congratulations {{1}} — unconditional offer from {{2}}! Open the app for next steps including tuition deposit.",
    "variables": 2
  },
  "app_rejected": {
    "id": "app_rejected",
    "category": "utility",
    "body": "Hi, decision received from {{1}}. Your counsellor will call you to discuss next options. Don't worry — there are good paths forward.",
    "variables": 1
  },
  "payment_invoice": {
    "id": "payment_invoice",
    "category": "utility",
    "body": "Invoice ready: {{1}} — {{2}}, due {{3}}. Open the app to review and pay.",
    "variables": 3
  },
  "gic_certificate_ready": {
    "id": "gic_certificate_ready",
    "category": "utility",
    "body": "Your GIC certificate is issued. Tap the app to download and add to your visa file.",
    "variables": 0
  },
  "visa_appointment_booked": {
    "id": "visa_appointment_booked",
    "category": "utility",
    "body": "Your VFS appointment is booked at {{1}} on {{2}}. Bring all documents on the visa-day checklist in the app.",
    "variables": 2
  },
  "visa_submitted": {
    "id": "visa_submitted",
    "category": "utility",
    "body": "Visa application submitted to {{1}}. Now we wait. Average processing time and updates will appear in the app.",
    "variables": 1
  },
  "visa_decision_approved": {
    "id": "visa_decision_approved",
    "category": "utility",
    "body": "{{1}} — your visa is APPROVED! Open the app for pre-departure next steps.",
    "variables": 1
  },
  "visa_decision_other": {
    "id": "visa_decision_other",
    "category": "utility",
    "body": "Hi, your visa decision has been received. Your counsellor will call you within today to discuss. Stay strong — we'll work through this with you.",
    "variables": 0
  },
  "housing_confirmed": {
    "id": "housing_confirmed",
    "category": "utility",
    "body": "Housing confirmed: {{1}}, move-in {{2}}. Address and key collection details in the app.",
    "variables": 2
  },
  "airport_pickup_confirmed": {
    "id": "airport_pickup_confirmed",
    "category": "utility",
    "body": "Airport pickup confirmed. Driver: {{1}} ({{2}}). Meeting point: {{3}}. Save this number.",
    "variables": 3
  },
  "arrival_welcome": {
    "id": "arrival_welcome",
    "category": "utility",
    "body": "Welcome {{1}}! We're so glad you've arrived. Your first check-in is in 48 hours. Anything urgent — message your counsellor anytime.",
    "variables": 1
  },
  "fair_invitation": {
    "id": "fair_invitation",
    "category": "marketing",
    "body": "You're invited: {{1}} on {{2}} at {{3}}. Universities will be there to make on-the-spot offers. Reply YES to RSVP.",
    "variables": 3
  },
  "parent_daily_digest": {
    "id": "parent_daily_digest",
    "category": "utility",
    "body": "Today for {{1}}: {{2}}. Open the app for full details.",
    "variables": 2
  }
};
