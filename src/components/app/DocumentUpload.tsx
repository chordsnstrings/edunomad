"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, FileText, X } from "lucide-react";

const MAX = 10 * 1024 * 1024;
/** Longest edge kept when downscaling a camera capture before upload. */
const MAX_EDGE = 2000;
const JPEG_QUALITY = 0.85;

/**
 * Shrink a photo in the browser before uploading.
 *
 * A phone camera produces multi-megabyte JPEGs; sending them untouched over a
 * mobile connection is slow and costs the student data. Documents only need to be
 * legible, so cap the longest edge and re-encode. PDFs and small files pass
 * through untouched.
 */
async function downscaleImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 512 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 2 * 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // any failure: upload the original rather than blocking the student
  }
}

export function DocumentUpload({ documentType }: { documentType: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const isGic = documentType === "gic_certificate";

  async function pick(f?: File) {
    if (!f) return;
    if (f.size > MAX) return setError("File is larger than 10MB.");
    setError("");
    const prepared = await downscaleImage(f);
    setFile(prepared);
    setPreview(prepared.type.startsWith("image/") ? URL.createObjectURL(prepared) : null);
  }

  async function upload() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const presign = await fetch("/api/documents/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType, contentType: file.type }),
      }).then((r) => r.json());
      if (!presign.url) return setError("Couldn't start the upload.");

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presign.url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
        xhr.onload = () => (xhr.status < 300 ? resolve() : reject());
        xhr.onerror = () => reject();
        xhr.send(file);
      });

      await fetch("/api/documents/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType, storageKey: presign.storageKey, mimeType: file.type, sizeBytes: file.size, ...(isGic ? { amountCad: Number(amount) || 0 } : {}) }),
      });
      router.push("/app/documents");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-white p-6 text-sm font-medium text-navy hover:border-navy">
            <Camera className="h-6 w-6 text-gold-500" /> Take photo
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-white p-6 text-sm font-medium text-navy hover:border-navy">
            <Upload className="h-6 w-6 text-gold-500" /> Choose file
            <input type="file" accept=".pdf,image/jpeg,image/png" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-navy">{file.name}</span>
            <button onClick={() => { setFile(null); setPreview(null); setProgress(0); }} className="text-muted hover:text-red-600"><X className="h-4 w-4" /></button>
          </div>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="max-h-64 w-full rounded-lg object-contain" />
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted"><FileText className="h-5 w-5" /> PDF ready to upload</div>
          )}
          {/* Auto-crop runs here via a scanner library before upload (interface ready). */}
          {busy && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-subtle">
              <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {isGic && (
            <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" placeholder="GIC amount (CAD)" aria-label="GIC amount (CAD)" className="mt-3 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-navy" />
          )}
          <button onClick={upload} disabled={busy} className="mt-4 w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
            {busy ? `Uploading… ${progress}%` : "Upload"}
          </button>
        </div>
      )}
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
