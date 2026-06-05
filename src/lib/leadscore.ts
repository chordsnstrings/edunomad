export type StudentForScore = {
  completenessPct?: number | null;
  academic?: { scoreType?: string; score?: number | null } | null;
  englishProficiency?: { type?: string } | null;
  budgetMaxUsd?: number | null;
  destinations?: string[] | null;
};

export type ScoreFactor = { factor: string; points: number; max: number };

function academicPct(a?: { scoreType?: string; score?: number | null } | null): number | null {
  if (!a || a.score == null) return null;
  return a.scoreType === "gpa" ? Number(a.score) * 10 : Number(a.score);
}

/** Transparent lead-score breakdown (max 100). */
export function leadScoreBreakdown(s: StudentForScore): ScoreFactor[] {
  const pct = academicPct(s.academic);
  const eng = s.englishProficiency?.type;
  const engPoints = eng === "in_hand" ? 20 : eng === "moi" ? 14 : eng === "planning" ? 10 : eng === "none" ? 4 : 0;
  return [
    { factor: "Profile completeness", points: Math.round(((s.completenessPct ?? 0) / 100) * 30), max: 30 },
    { factor: "Academic strength", points: pct == null ? 0 : Math.max(0, Math.min(25, Math.round((pct - 40) / 2.4))), max: 25 },
    { factor: "English readiness", points: engPoints, max: 20 },
    { factor: "Budget clarity", points: s.budgetMaxUsd ? (s.budgetMaxUsd >= 15000 ? 15 : 8) : 0, max: 15 },
    { factor: "Destinations set", points: (s.destinations?.length ?? 0) > 0 ? 10 : 0, max: 10 },
  ];
}

export function computeLeadScore(s: StudentForScore): number {
  return Math.min(100, leadScoreBreakdown(s).reduce((a, f) => a + f.points, 0));
}
