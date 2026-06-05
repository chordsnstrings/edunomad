import { logAudit } from "../audit";

export type LwwDecision = "client" | "server";

/**
 * Last-write-wins resolution. The client write applies when its timestamp is at
 * or after the server record's; a conflict is flagged when the server changed
 * after the client's version (a concurrent edit the client didn't see).
 */
export function resolveLww(
  serverUpdatedAt: Date | number,
  clientUpdatedAt: Date | number,
): { winner: LwwDecision; conflict: boolean } {
  const s = +new Date(serverUpdatedAt);
  const c = +new Date(clientUpdatedAt);
  return { winner: c >= s ? "client" : "server", conflict: s > c };
}

/**
 * Apply a queued offline write under LWW, recording an audit note whenever a
 * conflict was detected (CLAUDE.md §G016 acceptance #4).
 */
export async function applyLwwWithAudit(opts: {
  serverUpdatedAt: Date | number;
  clientUpdatedAt: Date | number;
  targetType: string;
  targetId: string;
  actorUserId?: string;
  apply: () => Promise<void>;
}): Promise<{ applied: boolean; winner: LwwDecision; conflict: boolean }> {
  const { winner, conflict } = resolveLww(opts.serverUpdatedAt, opts.clientUpdatedAt);
  if (winner === "client") await opts.apply();
  if (conflict) {
    await logAudit({
      actorUserId: opts.actorUserId ?? null,
      action: "sync.conflict",
      targetType: opts.targetType,
      targetId: opts.targetId,
      result: "success",
      reason: `offline sync LWW: ${winner} won`,
    });
  }
  return { applied: winner === "client", winner, conflict };
}
