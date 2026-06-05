// Seed a counsellor team + manager (idempotent).
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

const Y = (years) => new Date(Date.now() - years * 365 * 24 * 3600 * 1000);
const COUNSELLORS = [
  { phone: "+8801000000001", name: "Asha Rahman", langs: ["en", "bn"], dests: ["CA", "UK"], cap: 25, tenure: 3.5 },
  { phone: "+8801000000002", name: "Imran Hossain", langs: ["en", "bn"], dests: ["CA", "AU"], cap: 25, tenure: 2.0 },
  { phone: "+8801000000003", name: "Nadia Islam", langs: ["en", "bn", "hi"], dests: ["UK", "MY"], cap: 20, tenure: 1.0 },
  { phone: "+8801000000004", name: "Tanvir Ahmed", langs: ["en"], dests: ["AU", "MY"], cap: 30, tenure: 4.0 },
  { phone: "+8801000000005", name: "Sadia Karim", langs: ["en", "bn"], dests: ["CA", "UK", "AU", "MY"], cap: 22, tenure: 0.5 },
];

async function main() {
  if (await prisma.counsellorProfile.count()) {
    console.log("[seed-team] already populated");
    return;
  }
  const mgr = await prisma.user.upsert({
    where: { phone: "+8801000000000" },
    create: { phone: "+8801000000000", tenant: "edunomad", tenantId: "edunomad", role: "counsellor_manager", email: "cm@edunomad.app" },
    update: {},
  });
  for (const c of COUNSELLORS) {
    const u = await prisma.user.upsert({
      where: { phone: c.phone },
      create: { phone: c.phone, tenant: "edunomad", tenantId: "edunomad", role: "counsellor" },
      update: {},
    });
    await prisma.counsellorProfile.create({
      data: {
        userId: u.id, fullName: c.name, languages: c.langs, destinations: c.dests,
        capacity: c.cap, tenureStartedAt: Y(c.tenure), managerId: mgr.id,
      },
    });
  }
  console.log(`[seed-team] created ${COUNSELLORS.length} counsellors + 1 manager`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
