"use client";

import { useState } from "react";
import { useAutosave, SaveBadge } from "./useAutosave";

const QUALIFICATIONS = ["SSC / O-Level", "HSC / A-Level", "Diploma", "Bachelor's", "Master's"];
const CURRENT_YEAR = new Date().getFullYear();
const label = "block text-sm font-medium text-navy mb-1.5";
const field = "w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-navy";

type Academic = {
  qualification?: string;
  institution?: string;
  scoreType?: string;
  score?: number | string | null;
  year?: number | string | null;
};

export function AcademicStep({ initial }: { initial?: Academic | null }) {
  const a = initial ?? {};
  const [qualification, setQualification] = useState(String(a.qualification ?? ""));
  const [institution, setInstitution] = useState(String(a.institution ?? ""));
  const [scoreType, setScoreType] = useState(String(a.scoreType ?? "percentage"));
  const [score, setScore] = useState(a.score == null ? "" : String(a.score));
  const [year, setYear] = useState(a.year == null ? "" : String(a.year));
  const [err, setErr] = useState<string | null>(null);
  const { status, save } = useAutosave();

  function persist(next: Partial<Record<string, string>> = {}) {
    const v = { qualification, institution, scoreType, score, year, ...next };
    const sc = Number(v.score);
    const max = v.scoreType === "gpa" ? 10 : 100;
    if (v.score !== "" && (isNaN(sc) || sc < 0 || sc > max)) {
      setErr(`Enter a valid ${v.scoreType === "gpa" ? "GPA (0–10)" : "percentage (0–100)"}.`);
      return;
    }
    if (v.year !== "" && Number(v.year) > CURRENT_YEAR) {
      setErr("Year of completion can't be in the future.");
      return;
    }
    setErr(null);
    save({
      academic: {
        qualification: v.qualification,
        institution: v.institution,
        scoreType: v.scoreType,
        score: v.score === "" ? null : Number(v.score),
        year: v.year === "" ? null : Number(v.year),
      },
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={label}>Highest qualification</label>
        <select
          className={field}
          value={qualification}
          onChange={(e) => {
            setQualification(e.target.value);
            persist({ qualification: e.target.value });
          }}
        >
          <option value="">Select…</option>
          {QUALIFICATIONS.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={label}>Board / institution</label>
        <input
          className={field}
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          onBlur={() => persist()}
          placeholder="e.g. Dhaka Board, University of Dhaka" aria-label="e.g. Dhaka Board, University of Dhaka"
        />
      </div>

      <div>
        <label className={label}>Result</label>
        <div className="flex gap-2">
          <select
            className={`${field} w-32`}
            value={scoreType}
            onChange={(e) => {
              setScoreType(e.target.value);
              persist({ scoreType: e.target.value });
            }}
          >
            <option value="percentage">Percentage</option>
            <option value="gpa">GPA</option>
          </select>
          <input
            className={field}
            inputMode="decimal"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            onBlur={() => persist()}
            placeholder={scoreType === "gpa" ? "0–10" : "0–100"} aria-label={scoreType === "gpa" ? "0–10" : "0–100"}
          />
        </div>
      </div>

      <div>
        <label className={label}>Year of completion</label>
        <input
          className={field}
          inputMode="numeric"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          onBlur={() => persist()}
          placeholder={String(CURRENT_YEAR)} aria-label={String(CURRENT_YEAR)}
        />
      </div>

      {err && <p className="text-sm font-medium text-red-600">{err}</p>}
      <SaveBadge status={status} />
    </div>
  );
}
