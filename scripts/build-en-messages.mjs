// Generate src/i18n/messages/en.ts from docs/05-reference/ui-microcopy.md.
// Converts {{var}} placeholders to ICU {var} and escapes apostrophes for ICU.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const doc = readFileSync("docs/05-reference/ui-microcopy.md", "utf8");
const messages = {};
for (const line of doc.split("\n")) {
  const m = line.match(/^\|\s*([a-zA-Z0-9_.]+)\s*\|\s*(.+?)\s*\|\s*$/);
  if (!m) continue;
  const key = m[1];
  if (key === "Key" || key.toLowerCase() === "key") continue;
  let value = m[2]
    .replace(/\{\{\s*(\w+)\s*\}\}/g, "{$1}") // {{var}} -> {var}
    .replace(/'/g, "''"); // ICU: escape literal apostrophes
  messages[key] = value;
}

// A plural example so ICU plural rules are exercised/tested.
messages["demo.plural"] =
  "{count, plural, one {# programme} other {# programmes}}";

mkdirSync("src/i18n/messages", { recursive: true });
const body = `// AUTO-GENERATED from docs/05-reference/ui-microcopy.md
// Run: node scripts/build-en-messages.mjs
const en: Record<string, string> = ${JSON.stringify(messages, null, 2)};

export default en;
`;
writeFileSync("src/i18n/messages/en.ts", body);
console.log(`Wrote src/i18n/messages/en.ts with ${Object.keys(messages).length} keys`);
