import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import type { AuditLog, AuditResult } from "@prisma/client";
import { prisma } from "./db";
import { computeChainHash, GENESIS_HASH } from "./hashchain";

const AUDIT_LOCK = 911002;

export type AuditInput = {
  actorUserId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  beforeState?: unknown;
  afterState?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  result?: AuditResult;
  reason?: string | null;
};

function auditContent(a: {
  id: string;
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  beforeState: unknown;
  afterState: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  result: AuditResult;
  reason: string | null;
  createdAt: Date;
}) {
  return {
    id: a.id,
    actorUserId: a.actorUserId,
    action: a.action,
    targetType: a.targetType,
    targetId: a.targetId,
    beforeState: a.beforeState ?? null,
    afterState: a.afterState ?? null,
    ipAddress: a.ipAddress,
    userAgent: a.userAgent,
    result: a.result,
    reason: a.reason,
    createdAt: a.createdAt,
  };
}

/** Append a hash-chained audit entry (privileged actions + permission denials). */
export async function logAudit(input: AuditInput): Promise<AuditLog> {
  const id = randomUUID();
  const createdAt = new Date();
  const row = {
    id,
    actorUserId: input.actorUserId ?? null,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId ?? null,
    beforeState: (input.beforeState ?? null) as object | null,
    afterState: (input.afterState ?? null) as object | null,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
    result: input.result ?? "success",
    reason: input.reason ?? null,
    createdAt,
  };

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${AUDIT_LOCK})`;
    const prev = await tx.auditLog.findFirst({
      orderBy: { seq: "desc" },
      select: { chainHash: true },
    });
    const prevHash = prev?.chainHash ?? GENESIS_HASH;
    const chainHash = computeChainHash(auditContent(row), prevHash);
    return tx.auditLog.create({
      data: {
        id: row.id,
        actorUserId: row.actorUserId,
        action: row.action,
        targetType: row.targetType,
        targetId: row.targetId,
        beforeState:
          row.beforeState === null ? Prisma.DbNull : (row.beforeState as Prisma.InputJsonValue),
        afterState:
          row.afterState === null ? Prisma.DbNull : (row.afterState as Prisma.InputJsonValue),
        ipAddress: row.ipAddress,
        userAgent: row.userAgent,
        result: row.result,
        reason: row.reason,
        createdAt: row.createdAt,
        chainHash,
      },
    });
  });
}

export type AuditVerifyResult = {
  ok: boolean;
  count: number;
  brokenAt?: { id: string; seq: string };
};

export async function verifyAuditChain(): Promise<AuditVerifyResult> {
  const rows = await prisma.auditLog.findMany({ orderBy: { seq: "asc" } });
  let prevHash = GENESIS_HASH;
  for (const r of rows) {
    const expected = computeChainHash(auditContent(r), prevHash);
    if (expected !== r.chainHash) {
      return { ok: false, count: rows.length, brokenAt: { id: r.id, seq: String(r.seq) } };
    }
    prevHash = r.chainHash;
  }
  return { ok: true, count: rows.length };
}

/** Paginated audit-log query (for Compliance + Super Admin views). */
export async function queryAuditLogs(opts: {
  page?: number;
  perPage?: number;
  actorUserId?: string;
  targetType?: string;
  targetId?: string;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const perPage = Math.min(200, Math.max(1, opts.perPage ?? 50));
  const where = {
    ...(opts.actorUserId ? { actorUserId: opts.actorUserId } : {}),
    ...(opts.targetType ? { targetType: opts.targetType } : {}),
    ...(opts.targetId ? { targetId: opts.targetId } : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { seq: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.auditLog.count({ where }),
  ]);
  return { rows, total, page, perPage, pages: Math.ceil(total / perPage) };
}

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

/** Export the full audit log as CSV with a hash-chain integrity proof appended. */
export async function exportAuditCsv(): Promise<string> {
  const rows = await prisma.auditLog.findMany({ orderBy: { seq: "asc" } });
  const proof = await verifyAuditChain();
  const header = [
    "seq", "id", "created_at", "actor_user_id", "action", "target_type",
    "target_id", "result", "reason", "chain_hash",
  ].join(",");
  const lines = rows.map((r) =>
    [
      r.seq, r.id, r.createdAt.toISOString(), r.actorUserId, r.action,
      r.targetType, r.targetId, r.result, r.reason, r.chainHash,
    ].map(csvCell).join(","),
  );
  const tail = rows.length ? rows[rows.length - 1].chainHash : GENESIS_HASH;
  const footer = [
    "",
    `# hash-chain proof`,
    `# entries,${rows.length}`,
    `# genesis,${GENESIS_HASH}`,
    `# head_hash,${tail}`,
    `# verified,${proof.ok}`,
  ].join("\n");
  return [header, ...lines].join("\n") + "\n" + footer + "\n";
}
