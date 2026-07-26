import { randomUUID } from "node:crypto";

const COOKIE = "pawlink_id";
const YEAR = 60 * 60 * 24 * 365;

/**
 * Identity without an auth provider.
 *
 * The server hands each visitor a random id in an httpOnly cookie. It is what
 * scopes private pet profiles: you can only read the profiles created under
 * your own cookie. Nobody signs up, nobody picks a password, and there is no
 * third service to configure.
 *
 * The trade: clear your cookies and your health profiles are gone. That is the
 * right call for a lost-pet site people use once in a panic, but if you ever
 * want accounts that survive a new phone, this is the one file to replace.
 */
export function getDeviceId(req, res) {
  const jar = Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((c) => c.trim().split("="))
      .filter((p) => p.length === 2)
  );

  const existing = jar[COOKIE];
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;

  const id = randomUUID();
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${YEAR}`
  );
  return id;
}
