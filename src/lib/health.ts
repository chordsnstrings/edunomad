// Health check (G181). Used by GET /api/health and uptime monitoring.
import { prisma } from "./db";
import { isS3Configured, headBucket } from "./storage";

export type HealthStatus = {
  status: "ok" | "degraded";
  db: "ok" | "error";
  /** Object storage: "local" when S3 isn't configured (dev/filesystem backend). */
  storage: "ok" | "error" | "local";
  uptimeSeconds: number;
  version: string;
  time: string;
};

const startedAt = Date.now();

export async function checkHealth(): Promise<HealthStatus> {
  // Probe both dependencies. Reporting "ok" purely on the database meant an
  // object-storage outage — every document upload and download failing — looked
  // healthy to uptime monitoring.
  const [db, storage] = await Promise.all([checkDb(), checkStorage()]);
  return {
    status: db === "ok" && storage !== "error" ? "ok" : "degraded",
    db,
    storage,
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    version: process.env.APP_VERSION || process.env.VERCEL_GIT_COMMIT_SHA || "dev",
    time: new Date().toISOString(),
  };
}

async function checkDb(): Promise<"ok" | "error"> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return "ok";
  } catch {
    return "error";
  }
}

async function checkStorage(): Promise<"ok" | "error" | "local"> {
  if (!isS3Configured()) return "local";
  try {
    // Cheap reachability + credential check; never lists or reads object data.
    await headBucket();
    return "ok";
  } catch {
    return "error";
  }
}
