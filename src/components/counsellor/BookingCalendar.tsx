"use client";

import { useState } from "react";
import { Calendar, Check } from "lucide-react";

type Day = { date: string; slots: { startsAt: string; label: string }[] };

export function BookingCalendar({
  days,
  studentTz,
  action,
  hiddenFields = {},
  withDuration = true,
}: {
  days: Day[];
  studentTz: string;
  action: (fd: FormData) => void | Promise<void>;
  hiddenFields?: Record<string, string>;
  withDuration?: boolean;
}) {
  const [sel, setSel] = useState<string | null>(null);
  const [duration, setDuration] = useState("45");

  const fmtDay = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const fmtStudent = (iso: string) =>
    new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: studentTz }).format(new Date(iso));

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {days.map((d) => (
          <div key={d.date} className="w-32 shrink-0">
            <p className="mb-2 text-xs font-semibold text-muted">{fmtDay(d.date)}</p>
            <div className="space-y-1.5">
              {d.slots.length === 0 && <p className="text-xs text-muted">—</p>}
              {d.slots.map((s) => (
                <button
                  key={s.startsAt}
                  type="button"
                  onClick={() => setSel(s.startsAt)}
                  className={`w-full rounded-lg border px-2 py-1.5 text-sm ${
                    sel === s.startsAt ? "border-navy bg-navy text-white" : "border-line text-navy hover:bg-subtle"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {withDuration && (
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-navy">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="rounded-lg border border-line px-3 py-2 outline-none focus:border-navy">
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
          </select>
        </div>
      )}

      {sel && (
        <form action={action} className="mt-5 rounded-xl border border-line bg-subtle p-4">
          {Object.entries(hiddenFields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <input type="hidden" name="startsAt" value={sel} />
          <input type="hidden" name="durationMin" value={duration} />
          <p className="flex items-center gap-2 text-sm font-medium text-navy">
            <Calendar className="h-4 w-4" /> {fmtStudent(sel)}
          </p>
          <p className="mt-1 text-xs text-muted">Shown in the student&apos;s timezone ({studentTz}).</p>
          <button type="submit" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
            <Check className="h-4 w-4" /> Confirm booking
          </button>
        </form>
      )}
    </div>
  );
}
