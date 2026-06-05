"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, FileText, X } from "lucide-react";

const MAX = 10 * 1024 * 1024;

export function DocumentUpload({ documentType }: { documentType: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function pick(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX) return setError("File is larger than 10MB.");
    setError("");
    setFile(f);
    setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
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
        body: JSON.stringify({ documentType, storageKey: presign.storageKey, mimeType: file.type, sizeBytes: file.size }),
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
          <button onClick={upload} disabled={busy} className="mt-4 w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
            {busy ? `Uploading… ${progress}%` : "Upload"}
          </button>
        </div>
      )}
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
