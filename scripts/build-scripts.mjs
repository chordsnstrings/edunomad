// Generate src/lib/reference/scripts.ts from docs/05-reference/counsellor-scripts.md.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const doc = readFileSync("docs/05-reference/counsellor-scripts.md", "utf8");
const parts = doc.split(/^## /m);
const get = (name) => parts.find((p) => p.startsWith(name)) ?? "";

// Intro: first blockquote line.
const introBlock = get("60-second intro script");
const intro = (introBlock.match(/^>\s?(.*)$/m)?.[1] ?? "").replace(/^"|"$/g, "");

// 10 questions: numbered list.
const qBlock = get("10 qualification questions");
const questions = [...qBlock.matchAll(/^\d+\.\s+(.*)$/gm)].map((m) => m[1].trim());

const STOP = new Set("why should we use you instead of can i my the a is still get me are you was if when have or and to for what who how long does take go without".split(" "));
function keywords(headline) {
  return [...new Set(headline.toLowerCase().replace(/[^a-z\s/]/g, " ").split(/[\s/]+/).filter((w) => w.length > 2 && !STOP.has(w)))];
}

// Objections: ### headline + following blockquote.
const objBlock = get("15 objections and responses");
const objections = [...objBlock.split(/^### /m).slice(1)].map((b) => {
  const headline = b.split("\n")[0].trim();
  const response = (b.match(/^>\s?(.*)$/m)?.[1] ?? "").replace(/^"|"$/g, "");
  return { id: headline.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40), headline, response, keywords: keywords(headline) };
});

// Compliance guards: ### name, Keywords:, Modal text:.
const guardBlock = get("Compliance keyword guards");
const guards = [...guardBlock.split(/^### /m).slice(1)].map((b) => {
  const name = b.split("\n")[0].trim();
  const kw = [...(b.match(/Keywords:\s*(.*)/)?.[1].matchAll(/"([^"]+)"/g) ?? [])].map((m) => m[1]);
  const modalText = (b.match(/Modal text:\s*"?(.*?)"?\s*$/m)?.[1] ?? "").trim();
  return { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "_"), name, keywords: kw, modalText };
});

mkdirSync("src/lib/reference", { recursive: true });
const out = `// AUTO-GENERATED from docs/05-reference/counsellor-scripts.md
// Run: node scripts/build-scripts.mjs
export const INTRO_SCRIPT = ${JSON.stringify(intro)};
export const QUALIFICATION_QUESTIONS: string[] = ${JSON.stringify(questions, null, 2)};
export type Objection = { id: string; headline: string; response: string; keywords: string[] };
export const OBJECTIONS: Objection[] = ${JSON.stringify(objections, null, 2)};
export type ComplianceGuard = { id: string; name: string; keywords: string[]; modalText: string };
export const COMPLIANCE_GUARDS: ComplianceGuard[] = ${JSON.stringify(guards, null, 2)};
`;
writeFileSync("src/lib/reference/scripts.ts", out);
console.log(`Wrote scripts.ts: ${questions.length} questions, ${objections.length} objections, ${guards.length} guards`);
