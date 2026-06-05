export type SopBlock = { type: string; [k: string]: unknown };

export const BLOCK_TYPES = [
  "heading", "paragraph", "list", "table", "script", "template",
  "decision_tree", "checklist", "kpi", "compliance_warning", "trigger_rule", "reference",
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export function defaultBlock(type: string): SopBlock {
  switch (type) {
    case "heading": return { type, text: "Section heading" };
    case "paragraph": return { type, text: "" };
    case "list": return { type, items: [""] };
    case "table": return { type, rows: [["", ""]] };
    case "script": return { type, text: "", trigger: "" };
    case "template": return { type, text: "", variables: [] };
    case "decision_tree": return { type, question: "", options: [{ label: "", outcome: "" }] };
    case "checklist": return { type, items: [""], gate: false };
    case "kpi": return { type, metric: "students_assigned", target: 0 };
    case "compliance_warning": return { type, keywords: [], message: "" };
    case "trigger_rule": return { type, when: "", condition: "", surface: "" };
    case "reference": return { type, articleSlug: "", label: "" };
    default: return { type: "paragraph", text: "" };
  }
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "sop";
}

/** SOP edit permission (G154): owner, reviewer, or super admin. */
export function canEditSop(article: { ownerUserId?: string | null; reviewerUserId?: string | null }, user: { sub: string; role: string }): boolean {
  return user.role === "super_admin" || !article.ownerUserId || article.ownerUserId === user.sub || article.reviewerUserId === user.sub;
}

export const AUTHORING_GUIDE = [
  "Keep blocks short and single-purpose.",
  "Scripts are spoken verbatim — write how people talk.",
  "Templates use {{variable}} placeholders.",
  "Checklists marked as a gate block handoffs until green.",
  "compliance_warning keywords trigger a real-time modal — keep them precise.",
  "trigger_rule surfaces a block on a screen when its condition matches.",
];
