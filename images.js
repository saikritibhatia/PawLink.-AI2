/**
 * Every call goes to our own server. The Anthropic key, the database, and the
 * photo store all live there. The browser holds nothing sensitive.
 */
async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: "same-origin", // carries the cookie that scopes pet profiles
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
  return data;
}

const post = (path, body) =>
  request(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

/* the shared lost and found board */
export const listReports = () => request("/api/reports").then((d) => d.reports || []);
export const createReport = (report) => post("/api/reports", report).then((d) => d.report);
export const runMatch = (reportId) => post("/api/match", { reportId }).then((d) => d.matches || []);

/* adoption */
export const fetchRoster = () => request("/api/shelter").then((d) => d.pets || []);
export const runAdoptQuiz = (answers, note) => post("/api/adopt", { answers, note });

/* private pet profiles, scoped by cookie */
export const listPets = () => request("/api/pets").then((d) => d.pets || []);
export const createPet = (pet) => post("/api/pets", pet).then((d) => d.pet);

/* health triage */
export const runTriage = (pet, concern, since) => post("/api/triage", { pet, concern, since });
