// Contextual SOP snippets for the counsellor lead detail right rail.
// A seed of the SOP-into-app system (full CMS arrives in W6).
export type SopSnippet = { id: string; title: string; body: string };

type Ctx = {
  englishProficiency?: { type?: string } | null;
  academic?: { scoreType?: string; score?: number | null } | null;
  budgetMaxUsd?: number | null;
  destinations?: string[] | null;
};

function academicPct(a?: { scoreType?: string; score?: number | null } | null): number | null {
  if (!a || a.score == null) return null;
  return a.scoreType === "gpa" ? Number(a.score) * 10 : Number(a.score);
}

export function matchSnippets(s: Ctx): SopSnippet[] {
  const out: SopSnippet[] = [
    {
      id: "qualification_rubric",
      title: "Qualification rubric",
      body: "Score on academics, English, funds and intent. Qualified = clear funding + realistic destination + academics within one band of target programmes.",
    },
  ];
  const e = s.englishProficiency?.type;
  if (e === "none" || e === "planning" || e === "moi") {
    out.push({
      id: "no_ielts_pathways",
      title: "No-IELTS pathways",
      body: "Options: MOI letter (where accepted), Duolingo English Test, or pathway/foundation entry. Never promise a waiver — confirm per institution.",
    });
  }
  const pct = academicPct(s.academic);
  if (pct != null && pct < 55) {
    out.push({
      id: "low_score_guidance",
      title: "Below-threshold guidance",
      body: "For lower scores, steer to Tier 3–4 institutions, foundation routes, or Malaysia. Set expectations honestly; don't overpromise top-tier admits.",
    });
  }
  if (s.budgetMaxUsd != null && s.budgetMaxUsd < 15000) {
    out.push({
      id: "budget_reality",
      title: "Budget reality check",
      body: "Under USD 15k/yr realistically points to Malaysia or scholarship-dependent UK/CA. Walk through total cost incl. living + proof of funds.",
    });
  }
  return out;
}
