// Mark one or more goals done in goals/_index.json.
// Usage: node scripts/mark-goal-done.mjs G004 G005 ...
import { readFileSync, writeFileSync } from "node:fs";

const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error("usage: node scripts/mark-goal-done.mjs G004 [G005 ...]");
  process.exit(1);
}

const path = "goals/_index.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const now = new Date().toISOString();
let n = 0;
for (const g of data.goals) {
  if (ids.includes(g.id)) {
    g.status = "done";
    g.started_at = g.started_at ?? now;
    g.completed_at = now;
    n++;
  }
}
writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(`Marked ${n} goal(s) done: ${ids.join(", ")}`);
