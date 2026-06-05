"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Info, AlertCircle, Undo2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "info" | "error";
type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
  undo?: () => void;
};

type ToastInput = { kind?: ToastKind; message: string; undo?: () => void; duration?: number };

const ToastContext = createContext<(t: ToastInput) => void>(() => {});

/** Gmail-style toaster: success/info/error, with optional undo for reversible actions. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((cur) => cur.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ kind = "info", message, undo, duration = 5000 }: ToastInput) => {
      const id = Date.now() + Math.random();
      setItems((cur) => [...cur, { id, kind, message, undo }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="bottom-safe pointer-events-none fixed inset-x-0 z-[80] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <Row key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  info: <Info className="h-5 w-5 text-navy" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
};

function Row({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-sm shadow-black/5",
      )}
    >
      {ICONS[item.kind]}
      <p className="min-w-0 flex-1 text-sm text-ink">{item.message}</p>
      {item.undo && (
        <button
          type="button"
          onClick={() => {
            item.undo?.();
            onDismiss();
          }}
          className="inline-flex items-center gap-1 text-sm font-semibold text-gold-600 hover:underline"
        >
          <Undo2 className="h-4 w-4" /> Undo
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted hover:bg-subtle"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
