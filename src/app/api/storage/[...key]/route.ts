import type { NextRequest } from "next/server";
import {

  isS3Configured,
  verifyStorageToken,
  readLocalObject,
  writeLocalObject,
} from "@/lib/storage";

/** Mirrors the client-side document cap (DocumentUpload MAX). */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const dynamic = "force-dynamic";

// Local-backend signed URL endpoint (no-op when S3 serves URLs directly).

function parse(req: NextRequest, segs: string[]) {
  const key = segs.map(decodeURIComponent).join("/");
  const sp = req.nextUrl.searchParams;
  return { key, exp: Number(sp.get("exp")), sig: sp.get("sig") ?? "", method: sp.get("method") };
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ key: string[] }> }) {
  if (isS3Configured()) return new Response("Not found", { status: 404 });
  const { key } = await ctx.params;
  const { key: k, exp, sig, method } = parse(req, key);
  if (method !== "GET" || !verifyStorageToken(k, "GET", exp, sig)) {
    return new Response("Forbidden", { status: 403 });
  }
  try {
    const { body, contentType } = await readLocalObject(k);
    return new Response(new Uint8Array(body), { headers: { "Content-Type": contentType } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ key: string[] }> }) {
  if (isS3Configured()) return new Response("Not found", { status: 404 });
  const { key } = await ctx.params;
  const { key: k, exp, sig, method } = parse(req, key);
  if (method !== "PUT" || !verifyStorageToken(k, "PUT", exp, sig)) {
    return new Response("Forbidden", { status: 403 });
  }
  // Cap the body: this reads the whole upload into memory, so without a limit a
  // single request could exhaust the process. Matches the client-side 10MB cap.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_UPLOAD_BYTES) {
    return new Response("Payload Too Large", { status: 413 });
  }
  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.byteLength > MAX_UPLOAD_BYTES) {
    return new Response("Payload Too Large", { status: 413 });
  }
  await writeLocalObject(k, buf, req.headers.get("content-type") ?? "application/octet-stream");
  return new Response("OK");
}
