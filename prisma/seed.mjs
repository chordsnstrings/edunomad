// Seed: settings singleton, first admin user, sample per-country numbers.
// Run with: npm run db:seed   (loads .env via Prisma) — or: node prisma/seed.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;

// Dependency-free .env loader so the script works standalone too.
function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const text = readFileSync(join(here, "..", ".env"), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* no .env — rely on the real environment */
  }
}

loadEnv();
const prisma = new PrismaClient();

async function main() {
  // 1) Settings singleton (rich defaults beyond the schema defaults).
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      longDescription:
        "EduNomad is a mobile-first platform that guides students from Bangladesh, India and Nepal through the entire journey of studying abroad — from building a profile and matching to programmes in Canada, the UK, Australia and Malaysia, to documents, applications, tuition, GIC and a fully compliant visa file, all the way to arrival. A dedicated counsellor owns each student relationship, parents get their own secure visibility, and every visa file is signed off by a licensed compliance professional with a tamper-evident audit trail.",
      llmsSummary:
        "EduNomad helps students from South Asia apply to universities in Canada, the UK, Australia and Malaysia and complete the journey through visa approval and arrival. Core features: eligibility matching, a dedicated counsellor, a document vault with quality checks, regulated (RCIC/MARA) visa sign-off, parent visibility in local languages, and secure multi-currency payments including GIC.",
      facebookUrl: "https://facebook.com/edunomad",
      instagramUrl: "https://instagram.com/edunomad",
      linkedinUrl: "https://www.linkedin.com/company/edunomad",
    },
  });

  // 2) First admin user.
  const email = (process.env.ADMIN_EMAIL || "admin@edunomad.app")
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe!123";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: "Super Admin", passwordHash, role: "super_admin" },
  });

  // 3) Sample per-country contact numbers (replace in /admin/countries).
  const countries = [
    { countryCode: "BD", countryName: "Bangladesh", whatsapp: "+8801700000000", phone: "+8809600000000", displayName: "Dhaka Office", languages: "bn,en", sortOrder: 1 },
    { countryCode: "IN", countryName: "India", whatsapp: "+919000000000", phone: "+918040000000", displayName: "Bengaluru Office", languages: "hi,en", sortOrder: 2 },
    { countryCode: "NP", countryName: "Nepal", whatsapp: "+9779800000000", phone: "+97714000000", displayName: "Kathmandu Office", languages: "ne,en", sortOrder: 3 },
    { countryCode: "CA", countryName: "Canada", whatsapp: "+14160000000", phone: "+14160000000", displayName: "Toronto Office", languages: "en", sortOrder: 4 },
    { countryCode: "GB", countryName: "United Kingdom", whatsapp: "+442000000000", phone: "+442000000000", displayName: "London Office", languages: "en", sortOrder: 5 },
    { countryCode: "AE", countryName: "United Arab Emirates", whatsapp: "+971400000000", phone: "+971400000000", displayName: "Dubai Desk", languages: "en", sortOrder: 6 },
  ];
  for (const c of countries) {
    await prisma.countryContact.upsert({
      where: { countryCode: c.countryCode },
      update: c,
      create: c,
    });
  }

  console.log("Seed complete:");
  console.log("  • settings singleton ready");
  console.log(`  • admin user: ${email}`);
  console.log(`  • ${countries.length} country contacts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
