# Event catalog

> 73 events across 9 stages. The spine of the platform. Status timelines
> are computed from events; activity feed reads from events; notification
> routing uses per-event visibility and channels.

## Stages

| # | Name |
|---|---|
| 1 | Profile & Eligibility |
| 2 | Counsellor Onboarding |
| 3 | Shortlist |
| 4 | Application Prep |
| 5 | Application Submitted |
| 6 | University Decision |
| 7 | Tuition & GIC |
| 8 | Visa |
| 9 | Pre-Departure & Arrival |

## Visibility shorthand

S=student, P=parent, C=counsellor, O=operations, OM=ops manager,
CM=counsellor manager, COMP=compliance, F=finance, EM=education manager,
ADMIN=super admin

## Channels

`in_app` (always), `push`, `whatsapp`, `email`

## Templates

Each event ships with an EN template. BN/HI/NE templates start empty and
fall back to EN until populated through the certified translator pipeline.
Variables use `{{var_name}}` placeholders.

## The 73 events

| Event type | Stage | Emitted by | Visibility | Channels | Payload | EN template |
|---|---|---|---|---|---|---|
| `profile.created` | 1 | student, system | S | in_app | `{student_id}` | Profile created. |
| `profile.completed` | 1 | student | S, C | in_app, push | `{student_id, completeness_pct}` | Your profile is complete. We're matching you to programmes now. |
| `eligibility.checked` | 1 | system | S, C | in_app | `{student_id, programmes_matched}` | We found {{count}} programmes that match your profile. |
| `document_checklist.generated` | 1 | system | S | in_app, push | `{student_id, document_count}` | Your document checklist is ready. Tap to start uploading. |
| `parent.invite_sent` | 1 | student | S, P | in_app, whatsapp | `{student_id, parent_phone}` | Your parent has been invited. |
| `parent.invite_accepted` | 1 | parent | S, P, C | in_app, push | `{student_id, parent_id}` | Your parent joined and can now follow your application. |
| `counsellor.assigned` | 2 | system | S, P, C, CM | in_app, push, whatsapp | `{student_id, counsellor_id}` | {{counsellor_name}} is now your counsellor and will WhatsApp you within 4 working hours. |
| `counsellor.message_received` | 2 | counsellor | S, P | in_app, push, whatsapp | `{student_id, counsellor_id, message_preview}` | New message from {{counsellor_name}}. |
| `counsellor.call_scheduled` | 2 | counsellor | S, P, C | in_app, push, whatsapp, email | `{student_id, scheduled_at, duration_minutes}` | Your call with {{counsellor_name}} is scheduled for {{datetime}}. |
| `counsellor.call_completed` | 2 | counsellor | S, C, CM | in_app | `{student_id, counsellor_id, outcome_tag}` | Call completed. |
| `counsellor.reassigned` | 2 | counsellor_manager | S, P, C, CM | in_app, push, whatsapp | `{student_id, from_counsellor_id, to_counsellor_id, reason}` | {{new_counsellor_name}} is now your counsellor. |
| `shortlist.programme_added` | 3 | student, counsellor | S, C | in_app | `{student_id, programme_id, rationale}` | {{programme_name}} added to your shortlist. |
| `shortlist.programme_removed` | 3 | student, counsellor | S, C | in_app | `{student_id, programme_id}` | {{programme_name}} removed from your shortlist. |
| `shortlist.locked` | 3 | student | S, P, C, O, OM | in_app, push, whatsapp | `{student_id, programme_count}` | Your shortlist is locked. Operations will start packaging your applications. |
| `document.requested` | 4 | counsellor, operations | S, P | in_app, push, whatsapp | `{student_id, document_type, reason}` | Please upload your {{document_type}}. |
| `document.uploaded` | 4 | student, parent | S, C, O | in_app | `{student_id, document_type, document_id}` | {{document_type}} uploaded. Under review. |
| `document.approved` | 4 | operations | S, C | in_app | `{student_id, document_id}` | Your {{document_type}} is approved. |
| `document.rework_requested` | 4 | operations | S, P, C | in_app, push, whatsapp | `{student_id, document_id, reason}` | Your {{document_type}} needs a small fix: {{reason}}. |
| `document.expiring_soon` | 4 | system | S, C | in_app, push | `{student_id, document_type, expires_at}` | Your {{document_type}} expires in {{days}} days. |
| `sop.draft_generated` | 4 | system | S, C, O | in_app | `{student_id, application_id}` | Your SOP draft is ready for review. |
| `sop.feedback_received` | 4 | counsellor, operations | S | in_app, push | `{student_id, application_id, feedback_summary}` | Your SOP has been reviewed. |
| `sop.locked` | 4 | operations | S, C, O | in_app | `{student_id, application_id, version}` | Your SOP is locked. Application packaging begins. |
| `application.packaged` | 5 | operations | S, C, OM | in_app | `{application_id, university_id}` | Application to {{university_name}} packaged. Ready to submit. |
| `application.submitted` | 5 | operations | S, P, C, OM | in_app, push, whatsapp, email | `{application_id, university_id, submission_method, reference_id}` | Your application to {{university_name}} has been submitted. |
| `application.acknowledged` | 5 | operations | S, P, C | in_app, push | `{application_id}` | {{university_name}} confirmed receipt. |
| `application.under_review` | 5 | operations | S, P, C | in_app | `{application_id}` | {{university_name}} is reviewing your application. |
| `application.info_requested` | 5 | operations | S, P, C, O | in_app, push, whatsapp, email | `{application_id, request_summary}` | {{university_name}} has requested additional information. |
| `offer.conditional_received` | 6 | operations | S, P, C, O | in_app, push, whatsapp, email | `{application_id, conditions}` | Conditional offer received from {{university_name}}. |
| `offer.unconditional_received` | 6 | operations | S, P, C, O, F | in_app, push, whatsapp, email | `{application_id, deposit_deadline}` | Congratulations — unconditional offer from {{university_name}}! |
| `application.rejected` | 6 | operations | S, P, C | in_app, push, whatsapp, email | `{application_id, reason}` | {{university_name}} was unable to offer you a place. Your counsellor will discuss next options. |
| `offer.accepted` | 6 | student | S, P, C, O, F | in_app, push | `{application_id}` | You've accepted {{university_name}}'s offer. Next: tuition deposit. |
| `offer.declined` | 6 | student | S, C, O | in_app | `{application_id}` | Offer from {{university_name}} declined. |
| `conditions.met` | 6 | operations | S, P, C | in_app, push | `{application_id}` | All conditions met. Offer is now unconditional. |
| `payment.invoice_issued` | 7 | finance, system | S, P, F | in_app, push, whatsapp | `{invoice_id, amount, currency, due_date, purpose}` | Invoice for {{purpose}} — {{amount}} {{currency}}, due {{due_date}}. |
| `payment.received` | 7 | finance, system | S, P, F, C | in_app, push, email | `{invoice_id, amount, currency, method}` | Payment received: {{amount}} {{currency}} via {{method}}. |
| `gic.application_initiated` | 7 | student, parent | S, P, C, F | in_app, push | `{student_id, bank_partner_id}` | GIC application started with {{bank_name}}. |
| `gic.funds_transferred` | 7 | student, parent, finance | S, P, F | in_app, push, email | `{amount, currency}` | GIC transfer received by the bank. |
| `gic.certificate_issued` | 7 | bank_partner | S, P, C, O | in_app, push, whatsapp, email | `{student_id, certificate_id}` | GIC certificate issued. Tap to download. |
| `refund.initiated` | 7 | finance | S, P, F | in_app, push, email | `{refund_id, amount, reason}` | Refund of {{amount}} initiated. |
| `refund.completed` | 7 | finance | S, P, F | in_app, push, email | `{refund_id}` | Refund complete. |
| `visa_file.prep_started` | 8 | operations | S, P, C, O | in_app | `{visa_file_id}` | Visa file preparation has started. |
| `visa_file.ready_for_signoff` | 8 | operations_manager | O, OM, COMP | in_app | `{visa_file_id}` | Visa file ready for Compliance sign-off. |
| `visa_file.signed_off` | 8 | compliance | S, P, C, O, OM | in_app, push | `{visa_file_id, registration_number, version_hash}` | Your visa file has been signed off. |
| `visa_file.returned` | 8 | compliance | O, OM | in_app | `{visa_file_id, change_summary}` | Compliance returned the visa file with changes. |
| `visa.appointment_booked` | 8 | operations | S, P, C | in_app, push, whatsapp, email | `{student_id, location, datetime}` | VFS appointment: {{location}}, {{datetime}}. |
| `visa.application_submitted` | 8 | operations | S, P, C, O | in_app, push, whatsapp, email | `{visa_file_id}` | Visa application submitted to {{authority}}. |
| `visa.biometrics_completed` | 8 | student, operations | S, P, C | in_app, push | `{visa_file_id}` | Biometrics completed. |
| `visa.decision_approved` | 8 | operations | S, P, C, O, F | in_app, push, whatsapp, email | `{visa_file_id}` | Visa approved! Pre-departure begins. |
| `visa.decision_refused` | 8 | operations | S, P, C, O, COMP | in_app, push, whatsapp, email | `{visa_file_id, reason}` | Visa decision received. Your counsellor will call you. |
| `visa.additional_docs_requested` | 8 | operations | S, P, C, O | in_app, push, whatsapp, email | `{visa_file_id, request_summary}` | {{authority}} has requested additional documents. |
| `visa.passport_returned` | 8 | operations | S, P, C | in_app, push, whatsapp | `{visa_file_id, collection_location}` | Your passport is ready for collection. |
| `housing.booked` | 9 | pre_departure_coord | S, P, C | in_app, push, whatsapp, email | `{booking_id, property_name, move_in_date}` | Housing confirmed. |
| `bank_account.opening_initiated` | 9 | pre_departure_coord, student | S, P | in_app | `{bank_partner_id}` | Bank account opening started. |
| `sim.ordered` | 9 | pre_departure_coord, student | S, P | in_app | `{sim_partner_id}` | SIM ordered. |
| `insurance.activated` | 9 | pre_departure_coord | S, P | in_app, email | `{policy_id}` | Insurance policy active. |
| `airport_pickup.booked` | 9 | pre_departure_coord | S, P, C | in_app, push, whatsapp, email | `{pickup_id, driver_name, driver_phone, meeting_point}` | Airport pickup booked. |
| `flight.added` | 9 | student, pre_departure_coord | S, P, C | in_app | `{flight_number, departure, arrival}` | Flight details saved. |
| `predeparture.briefing_scheduled` | 9 | pre_departure_coord | S, P, C | in_app, push, whatsapp | `{datetime}` | Pre-departure briefing scheduled. |
| `arrival.confirmed` | 9 | pre_departure_coord, student | S, P, C | in_app, push, whatsapp | `{arrival_at}` | Arrival confirmed. Your first check-in is in 48 hours. |
| `checkin.30_day` | 9 | pre_departure_coord | S | in_app, push | `{student_id}` | 30-day check-in: how are you settling in? |
| `checkin.60_day` | 9 | pre_departure_coord | S | in_app, push | `{student_id}` | 60-day check-in. |
| `checkin.90_day` | 9 | pre_departure_coord | S | in_app, push | `{student_id}` | 90-day check-in. Alumni network access unlocked. |
| `alumni.access_granted` | 9 | system | S | in_app, push | `{student_id}` | Alumni network access unlocked. |
| `fair.invitation` | any | marketing | S, P | in_app, push, whatsapp, email | `{fair_id, name, datetime, venue}` | {{fair_name}} on {{date}}. |
| `fair.rsvp_confirmed` | any | student | S, marketing | in_app, email | `{fair_id, student_id}` | RSVP confirmed. |
| `spot_assessment.scheduled` | 3 | counsellor, marketing | S, P, C | in_app, push, whatsapp | `{fair_id, university_id, slot}` | Spot assessment with {{university_name}}. |
| `spot_offer.received` | 6 | marketing, operations | S, P, C, O | in_app, push, whatsapp, email | `{fair_id, university_id}` | Spot offer from {{university_name}}! |
| `login.new_device` | any | system | S | in_app, push | `{user_id, ip, user_agent}` | New login from a new device. |
| `password.changed` | any | user | S | in_app, email | `{user_id}` | Your password was changed. |
| `account.flagged` | any | system, compliance | COMP, ADMIN | in_app | `{user_id, reason}` | Account flagged for review. |
| `counsellor.escalated` | any | counsellor | CM, EM | in_app, push | `{student_id, escalation_type, severity}` | Escalation from {{counsellor_name}}: {{type}}. |
| `misrepresentation.flagged` | any | operations, compliance, system | COMP, EM | in_app, email | `{student_id, evidence_summary}` | Misrepresentation flag raised for review. |
| `sop.updated` | any | education_manager, role_owner | affected_roles | in_app | `{sop_id, version, change_summary}` | SOP updated: {{sop_name}}. |


## Notification policy

- **Critical** (push + WhatsApp + email, non-disableable): visa decisions,
  offer letters, payment confirmations, blocking document rejections,
  appointment reminders within 24h.
- **Important** (push + WhatsApp, email digest only): document requests,
  counsellor messages, status changes, fair invites.
- **Informational** (in-app only): minor status transitions, system events,
  audit-trail entries.
- **Quiet hours**: default 22:00–08:00 local time.
- **Parent daily digest**: WhatsApp summary at 18:00 local.

## Correction protocol

To correct a mistaken event, emit a new event of type `<original>.corrected`
with payload containing `{original_event_id, correction_note}`. The
original event remains in the chain; the correction is appended.
