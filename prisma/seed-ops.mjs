// Seed operations + compliance + finance users (idempotent).
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

const USERS = [
  { phone: "+8801000000010", role: "operations_manager", email: "om@edunomad.app" },
  { phone: "+8801000000011", role: "operations_team", email: "ops1@edunomad.app" },
  { phone: "+8801000000012", role: "operations_team", email: "ops2@edunomad.app" },
  { phone: "+8801000000020", role: "compliance", email: "compliance@edunomad.app" },
  { phone: "+8801000000030", role: "finance", email: "finance@edunomad.app" },
  { phone: "+8801000000040", role: "education_manager", email: "em@edunomad.app" },
];

async function main() {
  for (const u of USERS) {
    await prisma.user.upsert({
      where: { phone: u.phone },
      create: { phone: u.phone, tenant: "edunomad", tenantId: "edunomad", role: u.role, email: u.email },
      update: {},
    });
  }
  console.log(`[seed-ops] ensured ${USERS.length} internal users`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
