import { callClaude, parseJSON } from "./_lib/anthropic.js";
import { adoptContent } from "./_lib/prompts.js";
import { SHELTER_PETS } from "./_lib/pets.js";
import { clientIp, overLimit } from "./_lib/rateLimit.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST." });
  }
  if (overLimit(clientIp(req))) {
    return res.status(429).json({ error: "Too many requests. Wait a few minutes." });
  }

  const { answers, note } = req.body || {};
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Quiz answers are required." });
  }

  try {
    const out = parseJSON(await callClaude(adoptContent({ answers, note }), 1200));
    const byId = Object.fromEntries(SHELTER_PETS.map((p) => [p.id, p]));
    return res.status(200).json({
      topPick: out.topPick,
      summary: out.summary,
      matches: (out.matches || []).filter((m) => byId[m.id]).map((m) => ({ ...m, pet: byId[m.id] })),
    });
  } catch (e) {
    console.error("adopt failed", e);
    return res.status(500).json({ error: e.message || "The match did not run. Try again." });
  }
}
