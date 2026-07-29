"use client";

import { useState } from "react";
import { Plus, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { BLOCK_TYPES, defaultBlock, type SopBlock } from "@/lib/sop-cms";
import { saveSopBlocksAction } from "@/app/admin/(dashboard)/sop/actions";

const field = "w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-navy";

export function SopBlockEditor({ id, title: initialTitle, blocks: initialBlocks, disabled }: { id: string; title: string; blocks: SopBlock[]; disabled?: boolean }) {
  const [title, setTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState<SopBlock[]>(initialBlocks);
  const [addType, setAddType] = useState<string>("paragraph");

  const set = (i: number, patch: Partial<SopBlock>) => setBlocks((b) => b.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const add = () => setBlocks((b) => [...b, defaultBlock(addType)]);
  const move = (i: number, d: number) => setBlocks((b) => { const j = i + d; if (j < 0 || j >= b.length) return b; const c = [...b]; [c[i], c[j]] = [c[j], c[i]]; return c; });
  const del = (i: number) => setBlocks((b) => b.filter((_, j) => j !== i));

  const lines = (v: unknown) => (Array.isArray(v) ? v.join("\n") : "");
  const toLines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

  return (
    <form action={saveSopBlocksAction} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="blocks" value={JSON.stringify(blocks)} />
      <input aria-label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={disabled} className="w-full rounded-lg border border-line px-3 py-2.5 text-lg font-semibold text-navy" />

      {blocks.map((b, i) => (
        <div key={i} className="rounded-xl border border-line bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-subtle px-2 py-0.5 text-xs font-medium text-muted">{b.type}</span>
            {!disabled && (
              <div className="flex gap-1 text-muted">
                <button type="button" aria-label="Move block up" onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></button>
                <button type="button" aria-label="Move block down" onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></button>
                <button type="button" aria-label="Delete block" onClick={() => del(i)} className="hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            )}
          </div>
          {["heading", "paragraph", "script", "template"].includes(b.type) && (
            <textarea disabled={disabled} className={field} rows={b.type === "paragraph" || b.type === "script" ? 3 : 1} value={String(b.text ?? "")} onChange={(e) => set(i, { text: e.target.value })} placeholder="Text…" aria-label="Text…" />
          )}
          {b.type === "script" && <input disabled={disabled} className={`${field} mt-2`} value={String(b.trigger ?? "")} onChange={(e) => set(i, { trigger: e.target.value })} placeholder="Trigger condition" aria-label="Trigger condition" />}
          {b.type === "template" && <input disabled={disabled} className={`${field} mt-2`} value={lines(b.variables).replace(/\n/g, ", ")} onChange={(e) => set(i, { variables: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} placeholder="Variables (comma-separated)" aria-label="Variables (comma-separated)" />}
          {(b.type === "list" || b.type === "checklist") && (
            <textarea disabled={disabled} className={field} rows={3} value={lines(b.items)} onChange={(e) => set(i, { items: toLines(e.target.value) })} placeholder="One item per line" aria-label="One item per line" />
          )}
          {b.type === "checklist" && <label className="mt-1 flex items-center gap-2 text-xs text-muted"><input type="checkbox" checked={!!b.gate} disabled={disabled} onChange={(e) => set(i, { gate: e.target.checked })} /> Enforced gate (must be green to proceed)</label>}
          {b.type === "kpi" && (
            <div className="flex gap-2">
              <input disabled={disabled} className={field} value={String(b.metric ?? "")} onChange={(e) => set(i, { metric: e.target.value })} placeholder="Metric key" aria-label="Metric key" />
              <input disabled={disabled} type="number" className="w-28 rounded-lg border border-line px-3 py-2 text-sm" value={Number(b.target ?? 0)} onChange={(e) => set(i, { target: Number(e.target.value) })} placeholder="Target" aria-label="Target" />
            </div>
          )}
          {b.type === "compliance_warning" && (
            <div className="space-y-2">
              <input disabled={disabled} className={field} value={lines(b.keywords).replace(/\n/g, ", ")} onChange={(e) => set(i, { keywords: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} placeholder="Keywords (comma-separated)" aria-label="Keywords (comma-separated)" />
              <input disabled={disabled} className={field} value={String(b.message ?? "")} onChange={(e) => set(i, { message: e.target.value })} placeholder="Warning message" aria-label="Warning message" />
            </div>
          )}
          {b.type === "trigger_rule" && (
            <div className="space-y-2">
              <input disabled={disabled} className={field} value={String(b.when ?? "")} onChange={(e) => set(i, { when: e.target.value })} placeholder="when (e.g. counsellor_opens_lead_detail)" aria-label="when (e.g. counsellor_opens_lead_detail)" />
              <input disabled={disabled} className={field} value={String(b.condition ?? "")} onChange={(e) => set(i, { condition: e.target.value })} placeholder="if (condition)" aria-label="if (condition)" />
              <input disabled={disabled} className={field} value={String(b.surface ?? "")} onChange={(e) => set(i, { surface: e.target.value })} placeholder="surface (e.g. lead_detail.right_rail)" aria-label="surface (e.g. lead_detail.right_rail)" />
            </div>
          )}
          {b.type === "decision_tree" && <input disabled={disabled} className={field} value={String(b.question ?? "")} onChange={(e) => set(i, { question: e.target.value })} placeholder="Decision question" aria-label="Decision question" />}
          {b.type === "table" && <textarea disabled={disabled} className={field} rows={3} value={(b.rows as string[][] | undefined)?.map((r) => r.join(" | ")).join("\n") ?? ""} onChange={(e) => set(i, { rows: e.target.value.split("\n").map((r) => r.split("|").map((c) => c.trim())) })} placeholder="One row per line, cells separated by |" aria-label="One row per line, cells separated by |" />}
          {b.type === "reference" && (
            <div className="flex gap-2">
              <input disabled={disabled} className={field} value={String(b.articleSlug ?? "")} onChange={(e) => set(i, { articleSlug: e.target.value })} placeholder="Target SOP slug" aria-label="Target SOP slug" />
              <input disabled={disabled} className={field} value={String(b.label ?? "")} onChange={(e) => set(i, { label: e.target.value })} placeholder="Link label" aria-label="Link label" />
            </div>
          )}
        </div>
      ))}

      {!disabled && (
        <div className="flex items-center gap-2">
          <select value={addType} onChange={(e) => setAddType(e.target.value)} className="rounded-lg border border-line px-2 py-2 text-sm">
            {BLOCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg border border-navy px-3 py-2 text-sm font-semibold text-navy hover:bg-subtle"><Plus className="h-4 w-4" /> Add block</button>
          <button type="submit" className="ml-auto rounded-lg bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy-700">Save version</button>
        </div>
      )}
    </form>
  );
}
