import { prisma } from "./db";
import { estimateTotalCost } from "./cost";

export type Bucket = "reach" | "match" | "safe";

export type StudentProfile = {
  academic?: { scoreType?: string; score?: number | null } | null;
  englishProficiency?: { type?: string; testType?: string; score?: number | null } | null;
  budgetMaxUsd?: number | null;
  destinations?: string[] | null;
  fieldCategory?: string | null;
};

export type MatchCard = {
  id: string;
  name: string;
  institution: string;
  country: string;
  degreeLevel: string;
  tuitionPerYearUsd: number;
  intakeMonthsSupported: number[];
  englishMinIelts: number;
  totalCostUsd: number;
};

export function academicPercent(academic?: { scoreType?: string; score?: number | null } | null): number | null {
  if (!academic || academic.score == null) return null;
  return academic.scoreType === "gpa" ? Number(academic.score) * 10 : Number(academic.score);
}

type InstLike = { acceptsMoiLetter: boolean; englishMinIelts: number; englishMinDuolingo: number; englishMinPte: number };
type ProgLike = { englishMinSpecificIelts: number | null; englishMinSpecificDuolingo: number | null };

/** English check with MOI / Duolingo / PTE / TOEFL alternatives. */
export function meetsEnglish(
  inst: InstLike,
  prog: ProgLike,
  eng?: { type?: string; testType?: string; score?: number | null } | null,
): boolean {
  if (!eng || !eng.type || eng.type === "planning" || eng.type === "none") return true; // can test later
  if (eng.type === "moi") return !!inst.acceptsMoiLetter;
  if (eng.type === "in_hand") {
    const s = Number(eng.score);
    if (isNaN(s)) return true;
    switch (eng.testType) {
      case "Duolingo": return s >= (prog.englishMinSpecificDuolingo ?? inst.englishMinDuolingo);
      case "PTE": return s >= inst.englishMinPte;
      case "TOEFL": return s >= 80;
      default: return s >= (prog.englishMinSpecificIelts ?? inst.englishMinIelts);
    }
  }
  return true;
}

export function classify(studentPct: number | null, minPct: number, englishOk: boolean): Bucket | null {
  let b: Bucket;
  if (studentPct == null) b = "match";
  else if (studentPct >= minPct + 8) b = "safe";
  else if (studentPct >= minPct) b = "match";
  else if (studentPct >= minPct - 8) b = "reach";
  else return null;
  if (!englishOk) b = b === "safe" ? "match" : "reach";
  return b;
}

export type EligibilityResult = {
  reach: MatchCard[];
  match: MatchCard[];
  safe: MatchCard[];
  total: number;
  countries: string[];
};

export async function runEligibility(p: StudentProfile): Promise<EligibilityResult> {
  const dests = p.destinations && p.destinations.length ? p.destinations : ["CA", "UK", "AU", "MY"];
  const programmes = await prisma.programme.findMany({
    where: {
      active: true,
      ...(p.fieldCategory ? { fieldCategory: p.fieldCategory } : {}),
      ...(p.budgetMaxUsd ? { tuitionPerYearUsd: { lte: p.budgetMaxUsd } } : {}),
      institution: { country: { in: dests as ("CA" | "UK" | "AU" | "MY")[] } },
    },
    include: { institution: true },
    take: 600,
  });

  const pct = academicPercent(p.academic);
  const result: EligibilityResult = { reach: [], match: [], safe: [], total: 0, countries: [] };
  const countrySet = new Set<string>();

  for (const prog of programmes) {
    const englishOk = meetsEnglish(prog.institution, prog, p.englishProficiency);
    const bucket = classify(pct, prog.minAcademicPercentage ?? 50, englishOk);
    if (!bucket) continue;
    const cost = estimateTotalCost(prog.institution.country, prog.tuitionPerYearUsd, prog.durationMonths);
    result[bucket].push({
      id: prog.id,
      name: prog.name,
      institution: prog.institution.name,
      country: prog.institution.country,
      degreeLevel: prog.degreeLevel,
      tuitionPerYearUsd: prog.tuitionPerYearUsd,
      intakeMonthsSupported: prog.intakeMonthsSupported,
      englishMinIelts: prog.englishMinSpecificIelts ?? prog.institution.englishMinIelts,
      totalCostUsd: cost.total,
    });
    countrySet.add(prog.institution.country);
  }
  result.total = result.reach.length + result.match.length + result.safe.length;
  result.countries = [...countrySet];
  return result;
}
