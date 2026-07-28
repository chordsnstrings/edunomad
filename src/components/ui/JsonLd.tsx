/**
 * Inject schema.org JSON-LD.
 *
 * The payload embeds admin-editable settings (company name, descriptions,
 * contact details), so it is NOT inherently safe: raw JSON.stringify leaves "<"
 * untouched, and a value containing "</script>" would close the tag early and let
 * the remainder run as markup. Escaping the characters that can terminate or
 * reopen a script context keeps the JSON valid (these are legal JSON escapes)
 * while making break-out impossible. U+2028/U+2029 are escaped too because they
 * are literal line terminators in JavaScript.
 */
function safeJsonLd(data: object | object[]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
