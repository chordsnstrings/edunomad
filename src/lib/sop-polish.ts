import Anthropic from "@anthropic-ai/sdk";

export const WORD_TARGETS: Record<string, number> = { CA: 800, UK: 1000, AU: 800, MY: 600 };
export const TONE_GUIDES: Record<string, string> = {
  CA: "Specific and forward-looking. Tie study to clear career goals and ties to home. Avoid clichés and any guarantee language.",
  UK: "Academic and focused. Emphasise course fit and academic motivation. Concise, formal, no filler.",
  AU: "Genuine and practical. Show clear study plan and post-study intent within the rules. Avoid over-claiming.",
  MY: "Clear and sincere. Explain choice of Malaysia, affordability fit, and career relevance.",
};

export const PLAGIARISM_THRESHOLD = 15;

export type PolishResult = { polished: string; suggestions: string[]; aiUsed: boolean };

/** Polish an SOP. Uses the Claude API when ANTHROPIC_API_KEY is set; otherwise a
 *  deterministic mock so the screen works without a key (interface in place). */
export async function polishSop(content: string, destination: string): Promise<PolishResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  const target = WORD_TARGETS[destination] ?? 800;
  if (key && content.trim()) {
    try {
      const client = new Anthropic({ apiKey: key });
      const msg = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: `You are an expert Statement of Purpose editor for study-abroad applications to ${destination}. Improve clarity, structure, and authenticity while preserving the applicant's voice and facts. Target roughly ${target} words. Never invent facts, credentials, or any guarantee of admission/visa/PR. Return ONLY the polished SOP text.`,
        messages: [{ role: "user", content }],
      });
      const polished = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
      return { polished: polished || content, suggestions: ["Polished with Claude — review for accuracy."], aiUsed: true };
    } catch {
      /* fall through to mock */
    }
  }
  return {
    polished: content.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(),
    suggestions: [
      "Open with a specific moment, not a generic statement.",
      "Tie each goal to your chosen programme and to outcomes back home.",
      "Remove anything that reads as a guarantee (visa, PR, scholarship).",
    ],
    aiUsed: false,
  };
}

/** Mock plagiarism service: repeated-sentence ratio → pseudo-percentage. */
export function checkPlagiarism(content: string): number {
  const sentences = content.toLowerCase().split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 10);
  if (sentences.length < 2) return 0;
  const seen = new Set<string>();
  let dup = 0;
  for (const s of sentences) {
    if (seen.has(s)) dup++;
    else seen.add(s);
  }
  return Math.round((dup / sentences.length) * 100);
}

export function wordCount(content: string): number {
  return content.trim() ? content.trim().split(/\s+/).length : 0;
}
