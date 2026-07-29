// Apply append-only (insert-only) enforcement at the database layer for the
// hash-chained Event and AuditLog tables. Idempotent — safe to re-run.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const text = readFileSync(join(here, "..", ".env"), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const val = m[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[m[1]]) process.env[m[1]] = val;
    }
  } catch {
    /* rely on ambient env */
  }
}

loadEnv();
const prisma = new PrismaClient();

const statements = [
  `CREATE OR REPLACE FUNCTION en_prevent_mutation() RETURNS trigger AS $$
   BEGIN RAISE EXCEPTION 'Table % is append-only (insert-only)', TG_TABLE_NAME USING ERRCODE = 'check_violation'; END;
   $$ LANGUAGE plpgsql;`,
  // BEFORE UPDATE OR DELETE never fires for TRUNCATE, so the append-only
  // guarantee had a hole big enough to erase the whole log in one statement.
  // TRUNCATE triggers are statement-level and must be declared separately.
  `DROP TRIGGER IF EXISTS event_no_truncate ON "Event";`,
  `CREATE TRIGGER event_no_truncate BEFORE TRUNCATE ON "Event"
     FOR EACH STATEMENT EXECUTE FUNCTION en_prevent_mutation();`,
  `DROP TRIGGER IF EXISTS auditlog_no_truncate ON "AuditLog";`,
  `CREATE TRIGGER auditlog_no_truncate BEFORE TRUNCATE ON "AuditLog"
     FOR EACH STATEMENT EXECUTE FUNCTION en_prevent_mutation();`,
  `DROP TRIGGER IF EXISTS event_append_only ON "Event";`,
  `CREATE TRIGGER event_append_only BEFORE UPDATE OR DELETE ON "Event"
     FOR EACH ROW EXECUTE FUNCTION en_prevent_mutation();`,
  `DROP TRIGGER IF EXISTS auditlog_append_only ON "AuditLog";`,
  `CREATE TRIGGER auditlog_append_only BEFORE UPDATE OR DELETE ON "AuditLog"
     FOR EACH ROW EXECUTE FUNCTION en_prevent_mutation();`,
];

async function main() {
  for (const sql of statements) await prisma.$executeRawUnsafe(sql);
  console.log("[harden] append-only triggers applied to Event and AuditLog");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
