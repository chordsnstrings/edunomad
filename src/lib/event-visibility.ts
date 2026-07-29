/**
 * Named audiences for Event.visibility.
 *
 * The same literal maps were copy-pasted across 47 emit() call sites and had
 * already drifted — payment.received was emitted with a different audience from
 * finance than from the payment flow, so the two paths showed the event to
 * different people. Visibility decides who can see a record; it belongs in one
 * place, named, not re-typed per call site.
 *
 * Codes (CLAUDE.md §7): S student, P parent, C counsellor, O operations,
 * OM ops manager, CM counsellor manager, COMP compliance, F finance,
 * EM education manager, ADMIN super admin.
 */
export const AUDIENCE = {
  /** Student + their counsellor line. */
  studentAndCounsellor: { S: true, C: true, CM: true },
  /** Student, counsellor and the operations team handling their file. */
  studentCounsellorOps: { S: true, C: true, O: true, OM: true },
  /** Anything the parent/sponsor should also see. */
  studentAndParent: { S: true, P: true, C: true },
  /** Money: student, parent and finance. */
  money: { S: true, P: true, C: true, F: true },
  /** Visa milestones the student and every internal handler should see. */
  visaMilestone: { S: true, C: true, O: true, OM: true, COMP: true },
  /** Internal visa workflow only — not shown to the student. */
  visaInternal: { O: true, OM: true, COMP: true },
  /** Escalations and complaints. */
  escalation: { C: true, CM: true, EM: true },
} as const satisfies Record<string, Record<string, boolean>>;
