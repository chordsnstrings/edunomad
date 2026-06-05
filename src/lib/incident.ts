// Incident severity runbook variants (G165).
export const SEVERITIES = ["sev1", "sev2", "sev3"] as const;

export const RUNBOOKS: Record<string, string[]> = {
  sev1: [
    "Page on-call Compliance + Super Admin immediately",
    "Freeze affected accounts / actions",
    "Assess regulatory exposure",
    "Notify Education Manager",
    "Draft regulator notification if misrepresentation is involved",
    "Assemble the evidence packet",
    "Schedule a post-incident review within 48 hours",
  ],
  sev2: [
    "Notify Compliance + the relevant manager",
    "Contain the issue",
    "Identify affected students",
    "Document a timeline",
    "Schedule a post-incident review within 5 days",
  ],
  sev3: ["Log the incident", "Assign an owner", "Resolve within SLA", "Capture learnings"],
};
