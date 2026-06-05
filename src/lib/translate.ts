import Anthropic from "@anthropic-ai/sdk";
import { LOCALE_LABELS, type Locale } from "../i18n/config";

/** Auto-translate text into the target locale via Claude (no-op without a key). */
export async function translateText(text: string, target: Locale): Promise<string> {
  if (target === "en" || !text.trim()) return text;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return text; // interface in place; mock returns source
  try {
    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `Translate the user's message into ${LOCALE_LABELS[target]}. Preserve meaning and tone. Return only the translation.`,
      messages: [{ role: "user", content: text }],
    });
    return msg.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim() || text;
  } catch {
    return text;
  }
}
