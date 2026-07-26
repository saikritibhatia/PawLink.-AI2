import { imageBlock } from "./images.js";
import { distanceNote } from "./geocode.js";
import { SHELTER_PETS } from "./pets.js";

const clip = (s, n = 900) => String(s ?? "").slice(0, n);

/* ---------- 1. LOST + FOUND ---------- */
export async function matchContent({ report, candidates }) {
  const isLost = report.kind === "lost";
  const content = [];

  const notes = await Promise.all(
    candidates.map((c) => distanceNote(report.location, c.location))
  );

  content.push({
    type: "text",
    text: `You are the matching engine for PawLink, a lost and found pet service. Compare one report against candidate reports from the other side of the database and score how likely each candidate is the same animal.

Score each of these 0-100:
color (coat color match), pattern (markings: blaze, socks, mask, saddle, spots), size (build and weight), breed (breed-typical features, ear set, muzzle, coat length), distance (how plausible the two locations are for one animal traveling on foot), timeline (whether the found date makes sense given the missing date).

Then give an overall similarity 0-100 that weights visual identity above geography. When a candidate has no photo, judge appearance from the written description and say so in the reasoning. Be skeptical. An honest 22 is more useful to a worried owner than a hopeful 70, and a false match sends a stranger's pet to the wrong house. Never claim certainty from a photo alone.

THE ${isLost ? "LOST" : "FOUND"} REPORT
Name: ${clip(report.name) || "unknown"}
Animal: ${clip(report.animal_type, 40)}
${isLost ? "Last seen" : "Found at"}: ${clip(report.location, 200)}
Date ${isLost ? "missing" : "found"}: ${clip(report.event_date, 30) || "not given"}
Description: ${clip(report.description)}
Photo: ${report.photo_url ? "attached next" : "none on file"}`,
  });

  const main = await imageBlock(report.photo_url);
  if (main) content.push(main);

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    content.push({
      type: "text",
      text: `CANDIDATE ${c.case_id}
Animal: ${clip(c.animal_type, 40)}
${c.kind === "found" ? "Found at" : "Last seen"}: ${clip(c.location, 200)}
Date: ${clip(c.event_date, 30) || "not given"}
Description: ${clip(c.description)}
${notes[i] || ""}
Photo: ${c.photo_url ? "attached next" : "none on file"}`,
    });
    const p = await imageBlock(c.photo_url);
    if (p) content.push(p);
  }

  content.push({
    type: "text",
    text: `Reply with JSON only. No prose, no code fences.
[{"id":"CANDIDATE ID","similarity":0-100,"verdict":"Strong lead"|"Worth a look"|"Unlikely","breakdown":{"color":0-100,"pattern":0-100,"size":0-100,"breed":0-100,"distance":0-100,"timeline":0-100},"reasoning":"max 40 words, name the specific features that agree or disagree","checkNext":"one concrete step the person can take, max 15 words"}]
Sort highest similarity first. Include every candidate.`,
  });

  return content;
}

/* ---------- 2. ADOPTION ---------- */
export function adoptContent({ answers, note }) {
  const lines = Object.entries(answers || {})
    .map(([q, a]) => `${clip(q, 120)} -> ${clip(a, 120)}`)
    .join("\n");

  const roster = SHELTER_PETS.map(
    (p) => `${p.id} | ${p.name} | ${p.species} | ${p.breed} | ${p.age} | ${p.weight} | energy: ${p.energy} | ${p.profile} | needs: ${p.needs}`
  ).join("\n");

  return [{
    type: "text",
    text: `You match adopters to shelter animals for PawLink. People adopt on appearance and then discover the personality does not fit the life they actually live, and the animal comes back. Your job is to fit temperament and needs to the adopter's real routine.

ADOPTER
${lines}
Anything else they told us: ${clip(note, 500) || "nothing"}

SHELTER ROSTER
${roster}

Score compatibility 0-100 honestly. Hours alone, energy level, experience, kids, and other pets are hard constraints, not preferences. A very high energy working dog in an apartment with a nine hour workday scores low no matter how sweet it is. Respect their species choice unless they said Either. Do not flatter the adopter.

Reply with JSON only, no prose, no code fences.
{"topPick":"PET ID","summary":"why the top pick is the right call for this specific person, max 45 words","matches":[{"id":"PET ID","compatibility":0-100,"fit":"why this animal suits their routine, max 35 words","watch":"the one honest downside for them, max 20 words"}]}
Return the 4 best matches, highest first.`,
  }];
}

/* ---------- 3. HEALTH ---------- */
export function triageContent({ pet, concern, since }) {
  return [{
    type: "text",
    text: `You are PawLink Health, a triage guide for pet owners. You are NOT a veterinarian and you never diagnose. You explain what a symptom could mean, what makes it more or less worrying, and whether this needs a vet and how fast.

PET PROFILE ON FILE
Name: ${clip(pet.name, 60)}
Species: ${clip(pet.species, 40)}
Breed: ${clip(pet.breed, 80)}
Age: ${clip(pet.age, 40) || "not given"}
Weight: ${clip(pet.weight, 40) || "not given"}
Color and markings: ${clip(pet.color, 120) || "not given"}
Known allergies: ${clip(pet.allergies, 200) || "none listed"}
Existing conditions: ${clip(pet.conditions, 300) || "none listed"}
Current medications: ${clip(pet.meds, 200) || "none listed"}
Normal behavior baseline: ${clip(pet.baseline, 400) || "not given"}

WHAT THE OWNER IS SEEING NOW
${clip(concern, 1200)}
Going on for: ${clip(since, 60)}

Compare the new report against the profile. Breed, age, weight, allergies, existing conditions, and medications must visibly change your reasoning, and you must say how. Be honest about uncertainty. If anything suggests an emergency (trouble breathing, bloat signs, seizure, collapse, a swallowed toxin, uncontrolled bleeding, straining and unable to urinate, pale or blue gums, suspected heatstroke, a toxic food or plant), urgency is emergency and you say so first.

Reply with JSON only, no prose, no code fences.
{"urgency":"emergency"|"urgent"|"soon"|"monitor",
"urgencyLine":"one sentence saying what to do and how fast, max 20 words",
"profileFactors":["how a specific thing on this pet's profile changes the picture, max 18 words each, 2-3 items"],
"possibleCauses":[{"name":"plain-language name","likelihood":"More likely"|"Possible"|"Less likely","why":"what in the report points here, max 30 words"}],
"redFlags":["a specific sign that means go now, max 12 words each, 3-4 items"],
"nextSteps":["a concrete thing the owner can do today, max 16 words each, 3-4 items"],
"askYourVet":["a question to bring to the vet, max 14 words each, 2-3 items"]}
Give 3 or 4 possible causes.`,
  }];
}
