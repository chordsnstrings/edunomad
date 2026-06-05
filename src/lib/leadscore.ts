export type StudentForScore = {
  completenessPct?: number | null;
  englishProficiency?: { type?: string } | null;
  budgetMaxUsd?: number | null;
  destinations?: string[] | null;
  intakeTarget?: { choice?: string } | null;
  sourceAttribution?: Record<string, unknown> | null;
};

export type ScoreFactor = { factor: string; points: number; max: number };

// G048 weights: completeness 30, English 15, budget realism 20,
// destination clarity 10, intake urgency 10, source quality 15.
export function leadScoreBreakdown(s: StudentForScore): ScoreFactor[] {
  const eng = s.englishProficiency?.type;
  const english = eng === "in_hand" ? 15 : eng === "moi" ? 12 : eng === "planning" ? 8 : eng === "none" ? 3 : 0;

  const max = s.budgetMaxUsd ?? 0;
  const budget = max >= 10000 ? 20 : max > 0 ? 12 : 0;

  const dests = s.destinations?.length ?? 0;
  const destination = dests >= 1 ? 10 : 0;

  const choice = s.intakeTarget?.choice;
  const intake = choice === "specific" ? 10 : choice === "next_viable" ? 7 : choice === "undecided" ? 3 : 0;

  const attr = s.sourceAttribution ?? {};
  const source =
    attr["referral_code"] || attr["fair_qr_token"]
      ? 15
      : attr["utm_source"] || attr["utm_campaign"]
        ? 10
        : 7;

  return [
    { factor: "Profile completeness", points: Math.round(((s.completenessPct ?? 0) / 100) * 30), max: 30 },
    { factor: "English readiness", points: english, max: 15 },
    { factor: "Budget realism", points: budget, max: 20 },
    { factor: "Destination clarity", points: destination, max: 10 },
    { factor: "Intake urgency", points: intake, max: 10 },
    { factor: "Source quality", points: source, max: 15 },
  ];
}

export function computeLeadScore(s: StudentForScore): number {
  return Math.min(100, leadScoreBreakdown(s).reduce((a, f) => a + f.points, 0));
}
