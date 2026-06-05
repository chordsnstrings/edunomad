// Seed a starter SOP corpus (published) — stand-in for the operating-manual import.
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

const SOPS = [
  { title: "No-IELTS pathways", slug: "no-ielts-pathways", category: "Counselling", blocks: [
    { type: "heading", text: "No-IELTS pathways" },
    { type: "paragraph", text: "Options when a student has no English test yet — confirm per institution." },
    { type: "list", items: ["MOI letter where accepted", "Duolingo English Test", "Pathway / foundation entry"] },
    { type: "compliance_warning", keywords: ["waiver", "guarantee"], message: "Never promise an English waiver." },
    { type: "trigger_rule", when: "counsellor_opens_lead_detail", condition: "student.english_proficiency == 'none'", surface: "lead_detail.right_rail" },
    { type: "reference", articleSlug: "qualification-rubric", label: "See: Qualification rubric" },
  ] },
  { title: "Qualification rubric", slug: "qualification-rubric", category: "Counselling", blocks: [
    { type: "heading", text: "Qualification rubric" },
    { type: "checklist", items: ["Clear funding source", "Realistic destination", "Academics within one band of targets"], gate: true },
    { type: "kpi", metric: "shortlists_locked", target: 50 },
  ] },
  { title: "Visa file packaging standard", slug: "visa-file-packaging", category: "Operations", blocks: [
    { type: "heading", text: "Visa file packaging" },
    { type: "checklist", items: ["All required forms present", "Names match passport", "GIC at or above threshold", "Cross-document consistency checked"], gate: true },
    { type: "compliance_warning", keywords: ["100% visa", "guaranteed"], message: "No role may guarantee a visa." },
  ] },
];

async function main() {
  if (await prisma.sopArticle.count()) {
    console.log("[seed-sop] already populated");
    return;
  }
  const admin = await prisma.adminUser.findFirst();
  for (const s of SOPS) {
    await prisma.sopArticle.create({
      data: { title: s.title, slug: s.slug, category: s.category, ownerUserId: admin?.id ?? null, status: "published", version: 1, publishedVersion: 1, blocks: s.blocks, publishedBlocks: s.blocks },
    });
  }
  console.log(`[seed-sop] created ${SOPS.length} published SOPs`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
