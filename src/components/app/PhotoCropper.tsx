"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function PhotoCropper({ spec }: { spec: { w: number; h: number; label: string; bg: string } }) {
  const router = useRouter();
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const aspect = spec.w / spec.h;
  const OUT_W = spec.w * 12;
  const OUT_H = spec.h * 12;

  async function cropAndUpload() {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUT_W;
    canvas.height = OUT_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, OUT_W, OUT_H);
    const scale = Math.max(OUT_W / img.naturalWidth, OUT_H / img.naturalHeight) * zoom;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (OUT_W - dw) / 2, (OUT_H - dh) / 2, dw, dh);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.9));
    if (!blob) return;
    setBusy(true);
    try {
      const file = new File([blob], "visa-photo.jpg", { type: "image/jpeg" });
      const presign = await fetch("/api/documents/presign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentType: "photographs", contentType: "image/jpeg" }) }).then((r) => r.json());
      await fetch(presign.url, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: file });
      await fetch("/api/documents/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentType: "photographs", storageKey: presign.storageKey, mimeType: "image/jpeg", sizeBytes: file.size }) });
      router.push("/app/documents");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-subtle p-3 text-sm text-muted">
        Spec: {spec.label}, background {spec.bg}. Position your face in the frame.
      </div>
      <label className="block">
        <span className="text-sm font-medium text-navy">Choose a photo</span>
        <input type="file" accept="image/*" capture="user" className="mt-1 block w-full text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImgUrl(URL.createObjectURL(f)); }} />
      </label>

      {imgUrl && (
        <>
          <div className="mx-auto overflow-hidden rounded-lg border-2 border-navy" style={{ width: 180, height: 180 / aspect }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={imgUrl} alt="To crop" className="h-full w-full object-cover" style={{ transform: `scale(${zoom})` }} />
          </div>
          <label className="block text-sm">
            Zoom
            <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
          </label>
          <button onClick={cropAndUpload} disabled={busy} className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
            {busy ? "Uploading…" : "Crop & upload"}
          </button>
        </>
      )}
    </div>
  );
}
