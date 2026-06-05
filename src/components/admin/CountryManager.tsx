"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";
import {
  upsertCountryAction,
  deleteCountryAction,
  type FormState,
} from "@/app/admin/actions";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { flagEmoji } from "@/lib/utils";
import type { CountryContact } from "@/lib/settings";

export function CountryManager({ countries }: { countries: CountryContact[] }) {
  // null = list view; "new" = add form; object = edit form
  const [editing, setEditing] = useState<CountryContact | "new" | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Country numbers</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Set a WhatsApp and call number per country. Visitors from that
            country see it automatically; everyone else sees your default.
          </p>
        </div>
        {editing === null && (
          <Button variant="primary" onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" /> Add country
          </Button>
        )}
      </div>

      {editing !== null && (
        <CountryForm
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? undefined : editing}
          onDone={() => setEditing(null)}
        />
      )}

      {countries.length === 0 && editing === null ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-muted">
            No country numbers yet. Add one so visitors see a local number.
          </p>
          <div className="mt-4">
            <Button variant="primary" onClick={() => setEditing("new")}>
              <Plus className="h-4 w-4" /> Add your first country
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {countries.map((c) => (
            <Card
              key={c.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-2xl" aria-hidden>
                  {flagEmoji(c.countryCode)}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold text-navy">
                    {c.countryName}
                    <span className="text-xs font-normal text-muted">
                      {c.countryCode}
                    </span>
                    {!c.enabled && <Badge>Disabled</Badge>}
                  </p>
                  <p className="truncate text-sm text-muted">
                    WhatsApp {c.whatsapp} · Call {c.phone}
                    {c.displayName ? ` · ${c.displayName}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditing(c)}
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <form
                  action={deleteCountryAction}
                  onSubmit={(e) => {
                    if (!confirm(`Delete the number for ${c.countryName}?`))
                      e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    aria-label={`Delete ${c.countryName}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CountryForm({
  initial,
  onDone,
}: {
  initial?: CountryContact;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    upsertCountryAction,
    {},
  );
  const [code, setCode] = useState(initial?.countryCode ?? "");
  const [name, setName] = useState(initial?.countryName ?? "");
  const errors = state.fieldErrors;

  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);

  function onPickCode(value: string) {
    setCode(value);
    const found = getCountry(value);
    // Auto-fill the name when it's empty or still matches a known country.
    if (found && (!name || getCountry(initial?.countryCode)?.name === name)) {
      setName(found.name);
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy">
          {initial ? `Edit ${initial.countryName}` : "Add a country number"}
        </h2>
        <button
          type="button"
          onClick={onDone}
          aria-label="Close"
          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-subtle"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form action={action} className="mt-5 space-y-5">
        {initial && <input type="hidden" name="id" value={initial.id} />}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Country" required hint="Sets the flag and detection code.">
            <Select
              name="countryCode"
              value={code}
              onChange={(e) => onPickCode(e.target.value)}
              className={errors?.countryCode ? "border-red-400" : undefined}
            >
              <option value="" disabled>
                Select a country…
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </Select>
            {errors?.countryCode && (
              <p className="text-xs font-medium text-red-600">
                {errors.countryCode}
              </p>
            )}
          </Field>

          <Field label="Display name" required htmlFor="countryName">
            <Input
              id="countryName"
              name="countryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors?.countryName ? "border-red-400" : undefined}
            />
          </Field>

          <Field label="WhatsApp number" required hint="Include country code, e.g. +8801700000000.">
            <Input
              name="whatsapp"
              defaultValue={initial?.whatsapp}
              placeholder="+8801700000000"
              className={errors?.whatsapp ? "border-red-400" : undefined}
            />
            {errors?.whatsapp && (
              <p className="text-xs font-medium text-red-600">{errors.whatsapp}</p>
            )}
          </Field>

          <Field label="Call number" required>
            <Input
              name="phone"
              defaultValue={initial?.phone}
              placeholder="+8809600000000"
              className={errors?.phone ? "border-red-400" : undefined}
            />
            {errors?.phone && (
              <p className="text-xs font-medium text-red-600">{errors.phone}</p>
            )}
          </Field>

          <Field label="Office / team label" hint="Optional, e.g. “Dhaka Office”.">
            <Input name="displayName" defaultValue={initial?.displayName} />
          </Field>

          <Field label="Languages" hint="Comma-separated, e.g. bn,en. Used for structured data.">
            <Input name="languages" defaultValue={initial?.languages ?? "en"} />
          </Field>

          <Field label="Sort order" hint="Lower numbers show first.">
            <Input name="sortOrder" type="number" defaultValue={String(initial?.sortOrder ?? 0)} />
          </Field>

          <div className="flex items-end pb-1">
            <Toggle
              name="enabled"
              label="Enabled"
              hint="Disabled numbers are hidden from visitors."
              defaultChecked={initial ? initial.enabled : true}
            />
          </div>

          <Field label="Internal note" className="sm:col-span-2">
            <Textarea name="note" defaultValue={initial?.note} className="min-h-[72px]" />
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <div aria-live="polite" className="text-sm">
            {state.ok && (
              <span className="inline-flex items-center gap-1.5 font-medium text-green-700">
                <CheckCircle2 className="h-4 w-4" /> {state.message}
              </span>
            )}
            {state.error && (
              <span className="inline-flex items-center gap-1.5 font-medium text-red-700">
                <AlertCircle className="h-4 w-4" /> {state.error}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onDone}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Saving…" : initial ? "Save changes" : "Add country"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
