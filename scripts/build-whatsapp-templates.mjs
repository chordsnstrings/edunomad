// Generate src/lib/whatsapp-templates.ts from docs/05-reference/whatsapp-templates.md.
import { readFileSync, writeFileSync } from "node:fs";

const doc = readFileSync("docs/05-reference/whatsapp-templates.md", "utf8");
const templates = {};
let cur = null;
for (const line of doc.split("\n")) {
  const h = line.match(/^###\s+(\w+)\s*\(([^)]+)\)/);
  if (h) {
    cur = { id: h[1], category: h[2].trim(), body: "", variables: 0 };
    templates[cur.id] = cur;
    continue;
  }
  const b = line.match(/^>\s?(.*)$/);
  if (b && cur && !cur.body) {
    cur.body = b[1].trim();
    const found = cur.body.match(/\{\{(\d+)\}\}/g) || [];
    cur.variables = new Set(found).size;
  }
}

const body = `// AUTO-GENERATED from docs/05-reference/whatsapp-templates.md
// Run: node scripts/build-whatsapp-templates.mjs
export type WhatsAppTemplate = {
  id: string;
  category: string;
  body: string;
  variables: number;
};

export const WHATSAPP_TEMPLATES: Record<string, WhatsAppTemplate> = ${JSON.stringify(templates, null, 2)};
`;
writeFileSync("src/lib/whatsapp-templates.ts", body);
console.log(`Wrote src/lib/whatsapp-templates.ts with ${Object.keys(templates).length} templates`);
