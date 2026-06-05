"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type Result = { slug: string; title: string; category: string | null };

export function SopSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const res = await fetch(`/api/sop/search?q=${encodeURIComponent(q)}`).then((r) => r.json()).catch(() => ({ results: [] }));
      setResults(res.results ?? []);
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SOPs…" className="w-full rounded-lg border border-line py-2.5 pl-9 pr-3 text-sm outline-none focus:border-navy" />
      </div>
      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r.slug}>
            <Link href={`/sop/${r.slug}`} className="block rounded-xl border border-line bg-white p-3.5 text-sm hover:border-navy">
              <span className="font-semibold text-navy">{r.title}</span>
              {r.category && <span className="text-xs text-muted"> · {r.category}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
