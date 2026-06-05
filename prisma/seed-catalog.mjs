// Seed institutions + programmes across CA/UK/AU/MY (idempotent).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    for (const line of readFileSync(join(here, "..", ".env"), "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {}
}
loadEnv();
const prisma = new PrismaClient();

const FIELDS = ["business", "computing", "engineering", "health", "sciences", "social", "arts", "law", "education", "agriculture"];
const COUNTRY = {
  CA: { cities: ["Toronto", "Vancouver", "Montreal", "Calgary"], tuition: [12000, 34000], ielts: 6.0, duo: 110, pte: 58, psw: 3, moi: true, intakes: [1, 5, 9] },
  UK: { cities: ["London", "Manchester", "Birmingham", "Leeds"], tuition: [13000, 30000], ielts: 6.0, duo: 105, pte: 56, psw: 2, moi: true, intakes: [1, 9] },
  AU: { cities: ["Sydney", "Melbourne", "Brisbane", "Perth"], tuition: [15000, 38000], ielts: 6.0, duo: 110, pte: 58, psw: 3, moi: false, intakes: [2, 7] },
  MY: { cities: ["Kuala Lumpur", "Penang", "Johor", "Cyberjaya"], tuition: [4000, 12000], ielts: 5.5, duo: 95, pte: 50, psw: 1, moi: true, intakes: [1, 5, 9] },
};
const TYPES = ["University", "Institute of Technology", "University College"];
const FIELD_TITLES = {
  business: "Business Administration", computing: "Computer Science", engineering: "Engineering",
  health: "Public Health", sciences: "Applied Sciences", social: "Economics", arts: "Media & Communication",
  law: "Law", education: "Education", agriculture: "Environmental Science",
};

function rnd(a, b) { return Math.floor(a + Math.random() * (b - a)); }

async function main() {
  if ((await prisma.programme.count()) >= 400) {
    console.log("[seed-catalog] already populated");
    return;
  }
  let progCount = 0;
  for (const [code, c] of Object.entries(COUNTRY)) {
    for (let i = 0; i < 12; i++) {
      const tier = (i % 4) + 1;
      const city = c.cities[i % c.cities.length];
      const inst = await prisma.institution.create({
        data: {
          name: `${city} ${TYPES[i % TYPES.length]}${tier === 1 ? "" : " " + (i + 1)}`,
          country: code, city, tier,
          tuitionMinUsd: c.tuition[0], tuitionMaxUsd: c.tuition[1],
          intakeMonths: c.intakes,
          englishMinIelts: c.ielts + (tier === 1 ? 0.5 : 0),
          englishMinDuolingo: c.duo, englishMinPte: c.pte,
          acceptsMoiLetter: c.moi && tier > 1,
          postStudyWorkYears: c.psw, scholarshipAvailable: tier <= 2,
          dliOrEquivalentId: `${code}-DLI-${1000 + i}`,
          submissionTier: tier <= 2 ? 1 : tier === 3 ? 2 : 3,
          admissionsEmail: `admissions@${city.toLowerCase().replace(/\s/g, "")}${i}.edu`,
          commissionRateMinPct: 10, commissionRateMaxPct: 18, paymentTermsDays: 45,
        },
      });
      const minPct = tier === 1 ? 75 : tier === 2 ? 65 : tier === 3 ? 55 : 48;
      await prisma.programme.createMany({
        data: FIELDS.map((f, j) => ({
          institutionId: inst.id,
          name: `${j % 2 === 0 ? "BSc" : "MSc"} ${FIELD_TITLES[f]}`,
          degreeLevel: j % 2 === 0 ? "bachelor" : "master",
          fieldCategory: f,
          durationMonths: j % 2 === 0 ? 48 : 18,
          tuitionPerYearUsd: rnd(c.tuition[0], c.tuition[1]),
          intakeMonthsSupported: c.intakes,
          minAcademicPercentage: minPct,
          englishMinSpecificIelts: c.ielts + (f === "law" || f === "health" ? 0.5 : 0),
          englishMinSpecificDuolingo: c.duo,
        })),
      });
      progCount += FIELDS.length;
    }
  }
  console.log(`[seed-catalog] created institutions + ${progCount} programmes`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
