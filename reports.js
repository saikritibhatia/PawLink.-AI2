import { callClaude, parseJSON } from "./_lib/anthropic.js";
import { triageContent } from "./_lib/prompts.js";
import { clientIp, overLimit } from "./_lib/rateLimit.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST." });
  }
  if (overLimit(clientIp(req))) {
    return res.status(429).json({ error: "Too many requests. Wait a few minutes." });
  }

  const { pet, concern, since } = req.body || {};
  if (!pet || !concern) {
    return res.status(400).json({ error: "A pet profile and a description are required." });
  }

  try {
    return res.status(200).json(
      parseJSON(await callClaude(triageContent({ pet, concern, since }), 1200))
    );
  } catch (e) {
    console.error("triage failed", e);
    return res.status(500).json({ error: e.message || "The check did not run. Try again." });
  }
}
