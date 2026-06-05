import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const doc = readFileSync("docs/05-reference/parent-faq.md", "utf8");
const faqs = [];
for (const block of doc.split(/^### /m).slice(1)) {
  const lines = block.split("\n");
  const q = lines[0].replace(/^\d+\.\s*/, "").trim();
  const a = lines.slice(1).join(" ").replace(/\s+/g, " ").trim();
  if (q && a) faqs.push({ q, a });
}
mkdirSync("src/lib/reference", { recursive: true });
writeFileSync(
  "src/lib/reference/parent-faq.ts",
  `// AUTO-GENERATED from docs/05-reference/parent-faq.md\nexport type Faq = { q: string; a: string };\nexport const PARENT_FAQ: Faq[] = ${JSON.stringify(faqs, null, 2)};\n`,
);
console.log(`Wrote parent-faq.ts with ${faqs.length} FAQs`);
