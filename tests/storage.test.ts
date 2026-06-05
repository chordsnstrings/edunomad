import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { rm, stat } from "node:fs/promises";
import { join } from "node:path";
import {
  uploadObject,
  getDownloadUrl,
  getPresignedPutUrl,
  signStorageToken,
  verifyStorageToken,
} from "../src/lib/storage";

const KEY = "test-storage/doc.txt";

describe("G014 — object storage + signed URLs (local backend)", () => {
  after(async () => {
    await rm(join(process.cwd(), ".storage", "test-storage"), { recursive: true, force: true });
  });

  it("uploads bytes and returns the key", async () => {
    const key = await uploadObject(Buffer.from("hello"), KEY, "text/plain");
    assert.equal(key, KEY);
    const s = await stat(join(process.cwd(), ".storage", KEY));
    assert.ok(s.isFile());
  });

  it("issues a signed download URL with expiry", async () => {
    const url = await getDownloadUrl(KEY, 900);
    assert.ok(url.includes("/api/storage/"));
    assert.ok(url.includes("sig=") && url.includes("exp=") && url.includes("method=GET"));
  });

  it("issues a presigned PUT URL", async () => {
    const url = await getPresignedPutUrl(KEY, "text/plain", 900);
    assert.ok(url.includes("method=PUT"));
  });

  it("verifies valid tokens and rejects tampered/expired ones", () => {
    const exp = Date.now() + 60_000;
    const sig = signStorageToken(KEY, "GET", exp);
    const tampered = sig.slice(0, -1) + (sig.endsWith("0") ? "1" : "0");
    assert.equal(verifyStorageToken(KEY, "GET", exp, sig), true);
    assert.equal(verifyStorageToken(KEY, "GET", exp, tampered), false);
    assert.equal(verifyStorageToken(KEY, "GET", Date.now() - 1000, sig), false); // expired
    assert.equal(verifyStorageToken(KEY, "PUT", exp, sig), false); // wrong method
  });
});
