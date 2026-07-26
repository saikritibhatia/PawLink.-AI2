/**
 * Best-effort limiter. State lives in the memory of one warm serverless instance,
 * so a busy site with many instances will let a little more through than the
 * number below suggests. It is enough to stop a bored person with a loop.
 *
 * For a real ceiling, move this to Upstash Redis (@upstash/ratelimit) once the
 * site has traffic worth protecting. The interface below stays the same.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_CALLS = 20;
const hits = new Map();

export function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

/** Returns true when the caller is over the line. */
export function overLimit(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) hits.clear(); // crude memory guard

  return recent.length > MAX_CALLS;
}
