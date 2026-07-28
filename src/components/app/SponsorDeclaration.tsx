"use client";

import { useState } from "react";
import { Printer } from "lucide-react";

const input = "w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-navy";

export function SponsorDeclaration({ studentName }: { studentName: string }) {
  const [f, setF] = useState({ sponsor: "", relationship: "Parent", occupation: "", income: "", currency: "BDT", amount: "" });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const text = `I, ${f.sponsor || "[Sponsor name]"}, the ${f.relationship.toLowerCase()} of ${studentName}, hereby declare that I will fully sponsor their international studies. I am engaged as ${f.occupation || "[occupation]"} with a monthly income of ${f.income || "[income]"} ${f.currency}. I confirm available funds of ${f.amount || "[amount]"} ${f.currency} to cover tuition and living costs for the full duration of the programme. I make this declaration truthfully and accept responsibility for the financial support stated.`;

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <input className={input} placeholder="Sponsor full name" aria-label="Sponsor full name" value={f.sponsor} onChange={(e) => set("sponsor", e.target.value)} />
        <select className={input} value={f.relationship} onChange={(e) => set("relationship", e.target.value)}>
          {["Parent", "Sibling", "Guardian", "Relative", "Self"].map((r) => <option key={r}>{r}</option>)}
        </select>
        <input className={input} placeholder="Occupation / business" aria-label="Occupation / business" value={f.occupation} onChange={(e) => set("occupation", e.target.value)} />
        <input className={input} placeholder="Monthly income" aria-label="Monthly income" value={f.income} onChange={(e) => set("income", e.target.value)} />
        <input className={input} placeholder="Declared funds amount" aria-label="Declared funds amount" value={f.amount} onChange={(e) => set("amount", e.target.value)} />
        <input className={input} placeholder="Currency" aria-label="Currency" value={f.currency} onChange={(e) => set("currency", e.target.value)} />
      </div>
      <div className="rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink print:border-0">{text}</div>
      <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
        <Printer className="h-4 w-4" /> Print / save as PDF
      </button>
    </div>
  );
}
