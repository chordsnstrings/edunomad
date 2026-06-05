import type { Metadata } from "next";
import { FileText, ExternalLink } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { VISA_FORMS } from "@/lib/reference/visa-forms";

export const metadata: Metadata = { title: "Forms repository", robots: { index: false } };
export const dynamic = "force-dynamic";

const COUNTRY: Record<string, string> = { CA: "Canada", UK: "United Kingdom", AU: "Australia", MY: "Malaysia" };

export default async function FormsPage() {
  await requireStaff(["operations_team", "operations_manager"]);
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Forms repository</h1>
      <p className="mb-4 text-sm text-muted">Current regulator form versions per destination.</p>
      <div className="space-y-5">
        {Object.entries(VISA_FORMS).map(([country, forms]) => (
          <section key={country}>
            <h2 className="mb-2 text-sm font-semibold text-muted">{COUNTRY[country]}</h2>
            <ul className="space-y-2">
              {forms.map((f) => (
                <li key={f.id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3.5">
                  <FileText className="h-4 w-4 shrink-0 text-gold-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy">{f.label}</p>
                    <p className="text-xs text-muted">v{f.version}{f.required ? " · required" : " · optional"}</p>
                  </div>
                  {f.url && (
                    <a href={f.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-navy underline">
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
