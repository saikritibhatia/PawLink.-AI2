import { sql, ensureSchema } from "./_lib/db.js";
import { getDeviceId } from "./_lib/session.js";

/** Private pet profiles, scoped to the visitor's cookie. */
export default async function handler(req, res) {
  await ensureSchema();
  const deviceId = getDeviceId(req, res);

  if (req.method === "GET") {
    const rows = await sql`
      select * from pets where device_id = ${deviceId}::uuid order by created_at desc`;
    return res.status(200).json({ pets: rows });
  }

  if (req.method === "POST") {
    const b = req.body || {};
    if (!b.name?.trim() || !b.breed?.trim()) {
      return res.status(400).json({ error: "Name and breed are required." });
    }
    try {
      const [row] = await sql`
        insert into pets (device_id, name, species, breed, age, weight, color, allergies, conditions, meds, baseline)
        values (
          ${deviceId}::uuid, ${b.name.trim()}, ${b.species || "Dog"}, ${b.breed.trim()},
          ${b.age || null}, ${b.weight || null}, ${b.color || null}, ${b.allergies || null},
          ${b.conditions || null}, ${b.meds || null}, ${b.baseline || null}
        )
        returning *`;
      return res.status(200).json({ pet: row });
    } catch (e) {
      console.error("pet insert failed", e);
      return res.status(500).json({ error: "The profile did not save. Try again." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Use GET or POST." });
}
