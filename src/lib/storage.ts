import { createHmac, timingSafeEqual } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

// Object storage abstraction. Uses an S3-compatible bucket (AWS/R2/Spaces/MinIO)
// when configured via env; otherwise a local filesystem backend for dev.
// IMPORTANT: document binary is never logged (CLAUDE.md §11).

const LOCAL_DIR = join(process.cwd(), ".storage");
const SIGN_TTL_DEFAULT = 900; // 15 minutes

export function isS3Configured() {
  return !!(
    process.env.STORAGE_BUCKET &&
    (process.env.STORAGE_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID)
  );
}

function secret() {
  return process.env.AUTH_SECRET || "dev-insecure-secret-do-not-use";
}

export function signStorageToken(key: string, method: "GET" | "PUT", exp: number) {
  return createHmac("sha256", secret()).update(`${method}:${key}:${exp}`).digest("hex");
}

export function verifyStorageToken(
  key: string,
  method: "GET" | "PUT",
  exp: number,
  sig: string,
): boolean {
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = signStorageToken(key, method, exp);
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function localSignedUrl(key: string, method: "GET" | "PUT", ttlSec: number) {
  const exp = Date.now() + ttlSec * 1000;
  const sig = signStorageToken(key, method, exp);
  const path = key.split("/").map(encodeURIComponent).join("/");
  const q = new URLSearchParams({ exp: String(exp), method, sig });
  return `/api/storage/${path}?${q.toString()}`;
}

async function withS3() {
  const aws = await import("@aws-sdk/client-s3");
  const presigner = await import("@aws-sdk/s3-request-presigner");
  const client = new aws.S3Client({
    region: process.env.STORAGE_REGION || "auto",
    endpoint: process.env.STORAGE_ENDPOINT || undefined,
    forcePathStyle: !!process.env.STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: (process.env.STORAGE_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID)!,
      secretAccessKey: (process.env.STORAGE_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY)!,
    },
  });
  return { aws, presigner, client, bucket: process.env.STORAGE_BUCKET! };
}

/** Upload bytes; returns the storage key. */
export async function uploadObject(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  if (isS3Configured()) {
    const { aws, client, bucket } = await withS3();
    await client.send(
      new aws.PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType }),
    );
    return key;
  }
  await writeLocalObject(key, buffer, contentType);
  return key;
}

/** Time-limited download URL (15-min default). */
export async function getDownloadUrl(key: string, expiresSec = SIGN_TTL_DEFAULT): Promise<string> {
  if (isS3Configured()) {
    const { aws, presigner, client, bucket } = await withS3();
    return presigner.getSignedUrl(client, new aws.GetObjectCommand({ Bucket: bucket, Key: key }), {
      expiresIn: expiresSec,
    });
  }
  return localSignedUrl(key, "GET", expiresSec);
}

/** Presigned PUT URL for direct browser upload of large files. */
export async function getPresignedPutUrl(
  key: string,
  contentType: string,
  expiresSec = SIGN_TTL_DEFAULT,
): Promise<string> {
  if (isS3Configured()) {
    const { aws, presigner, client, bucket } = await withS3();
    return presigner.getSignedUrl(
      client,
      new aws.PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
      { expiresIn: expiresSec },
    );
  }
  return localSignedUrl(key, "PUT", expiresSec);
}

// ── Local backend file IO (used by the /api/storage route in dev) ──
export async function writeLocalObject(key: string, buffer: Buffer, contentType: string) {
  const path = join(LOCAL_DIR, key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, buffer);
  await writeFile(`${path}.meta`, contentType);
}

export async function readLocalObject(key: string) {
  const path = join(LOCAL_DIR, key);
  const [body, contentType] = await Promise.all([
    readFile(path),
    readFile(`${path}.meta`, "utf8").catch(() => "application/octet-stream"),
  ]);
  return { body, contentType };
}
