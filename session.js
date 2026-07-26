const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

/**
 * Calls Anthropic from the server. The key never reaches the browser.
 * `content` is an array of message content blocks (text and image).
 */
export async function callClaude(content, maxTokens = 1400) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set on the server.");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Anthropic error", res.status, detail.slice(0, 500));
    if (res.status === 429) throw new Error("The service is busy. Try again in a moment.");
    if (res.status === 401) throw new Error("The service is not configured correctly.");
    throw new Error("The service did not respond. Try again.");
  }

  const data = await res.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

/** Models sometimes wrap JSON in prose or fences. Dig it out. */
export function parseJSON(text) {
  const cleaned = String(text).replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const starts = [cleaned.indexOf("{"), cleaned.indexOf("[")].filter((i) => i >= 0);
    const first = starts.length ? Math.min(...starts) : -1;
    const last = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
    if (first >= 0 && last > first) {
      try {
        return JSON.parse(cleaned.slice(first, last + 1));
      } catch {
        /* fall through */
      }
    }
    throw new Error("The response could not be read. Try again.");
  }
}
