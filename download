import { SHELTER_PETS } from "./_lib/pets.js";

/** The adoption roster. Lives on the server so the browser cannot rewrite it. */
export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Use GET." });
  }
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
  return res.status(200).json({ pets: SHELTER_PETS });
}
