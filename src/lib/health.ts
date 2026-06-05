// Health check (G181). Used by GET /api/health and uptime monitoring.
import { prisma } from "./db";

export type HealthStatus = {
  status: "ok" | "degraded";
  db: "ok" | "error";
  uptimeSeconds: number;
  version: string;
  time: string;
};

const startedAt = Date.now();

export async function checkHealth(): Promise<HealthStatus> {
  let db: "ok" | "error" = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    db = "error";
  }
  return {
    status: db === "ok" ? "ok" : "degraded",
    db,
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    version: process.env.APP_VERSION || process.env.VERCEL_GIT_COMMIT_SHA || "dev",
    time: new Date().toISOString(),
  };
}
