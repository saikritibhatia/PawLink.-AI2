/**
 * Turns "Halston Park, near the ballfields" into coordinates so the matcher can
 * reason about a real number of miles instead of guessing from street names.
 *
 * Uses OpenStreetMap Nominatim: free, no key, but capped near 1 request/second
 * and it requires a contact address in the User-Agent. Set ENABLE_GEOCODING=false
 * to skip it entirely; matching still works, just with fuzzier distance reasoning.
 */
const cache = new Map(); // survives while the function instance is warm

const enabled = () => String(process.env.ENABLE_GEOCODING).toLowerCase() === "true";

async function geocode(place) {
  if (!place) return null;
  const key = place.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key);

  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(place);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": `PawLink AI (${process.env.GEOCODER_CONTACT || "contact not set"})`,
        "Accept-Language": "en",
      },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    const hit = rows && rows[0] ? { lat: Number(rows[0].lat), lon: Number(rows[0].lon) } : null;
    cache.set(key, hit);
    return hit;
  } catch {
    return null;
  }
}

function milesBetween(a, b) {
  const R = 3958.8;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Returns a short sentence for the prompt, or an empty string if we could not resolve it. */
export async function distanceNote(placeA, placeB) {
  if (!enabled()) return "";
  const [a, b] = await Promise.all([geocode(placeA), geocode(placeB)]);
  if (!a || !b) return "";
  const mi = milesBetween(a, b);
  return `Measured distance between the two locations: ${mi.toFixed(1)} miles.`;
}
