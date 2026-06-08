"use client";

import { useState } from "react";
import { useAutosave, SaveBadge } from "./useAutosave";
import { useT } from "@/i18n/LocaleProvider";

const OPTIONS = [
  { id: "in_hand", title: "I have a score", desc: "IELTS, TOEFL, PTE or Duolingo in hand" },
  { id: "planning", title: "Planning to take it", desc: "Booked or preparing" },
  { id: "moi", title: "Medium of Instruction", desc: "My studies were in English" },
  { id: "none", title: "None yet", desc: "Haven't decided" },
];
const TESTS = ["IELTS", "TOEFL", "PTE", "Duolingo"];

export function EnglishStep({ initial }: { initial?: Record<string, unknown> | null }) {
  const t = useT();
  const e = initial ?? {};
  const [type, setType] = useState(String(e.type ?? ""));
  const [testType, setTestType] = useState(String(e.testType ?? "IELTS"));
  const [score, setScore] = useState(e.score == null ? "" : String(e.score));
  const { status, save } = useAutosave();

  function persist(next: Record<string, string> = {}) {
    const v = { type, testType, score, ...next };
    save({
      englishProficiency: {
        type: v.type,
        testType: v.type === "in_hand" ? v.testType : null,
        score: v.type === "in_hand" && v.score !== "" ? v.score : null,
      },
    });
  }

  return (
    <div className="space-y-3">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => {
            setType(o.id);
            persist({ type: o.id });
          }}
          className={`flex w-full flex-col items-start rounded-xl border px-4 py-3 text-left ${
            type === o.id ? "border-navy bg-navy/5" : "border-line hover:bg-subtle"
          }`}
        >
          <span className="text-sm font-semibold text-navy">{t("profile.step.english.option_" + o.id)}</span>
          <span className="text-xs text-muted">{o.desc}</span>
        </button>
      ))}

      {type === "in_hand" && (
        <div className="flex gap-2 rounded-xl border border-line p-3">
          <select
            className="w-32 rounded-lg border border-line px-2 py-2 outline-none focus:border-navy"
            value={testType}
            onChange={(ev) => {
              setTestType(ev.target.value);
              persist({ testType: ev.target.value });
            }}
          >
            {TESTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            className="flex-1 rounded-lg border border-line px-3 py-2 outline-none focus:border-navy"
            placeholder="Score"
            value={score}
            onChange={(ev) => setScore(ev.target.value)}
            onBlur={() => persist()}
          />
        </div>
      )}
      {type === "moi" && (
        <p className="rounded-lg bg-subtle p-3 text-xs text-muted">
          You&apos;ll be able to upload your Medium of Instruction (MOI) letter later. Some
          universities accept it instead of a test.
        </p>
      )}
      <SaveBadge status={status} />
    </div>
  );
}
