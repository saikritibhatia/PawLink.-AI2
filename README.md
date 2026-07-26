# PawLink AI

Helping pets find their way home, and stay healthy for life.

1. **Lost + Found matching.** Owners and finders file reports to a shared public board. The matcher compares photos and descriptions on coat color, markings, size, breed features, distance, and timeline, and returns a similarity score with reasons.
2. **Adoption compatibility.** Nine questions about how you actually live. Shelter animals get ranked against your routine, not your taste in faces.
3. **PawLink Health.** A private profile for your pet, then a symptom check weighed against breed, age, weight, allergies, and conditions. A guide, not a veterinarian.

**One service.** Vercel hosts the site, runs the API, stores the photos, and provisions the database. There is nothing else to sign up for except an Anthropic API key.

| Piece | What it is |
|---|---|
| Frontend | React + Vite, compiled to plain HTML/CSS/JS |
| API | Vercel Functions, the `/api` folder, Node |
| Database | Neon Postgres, provisioned from Vercel's Storage tab |
| Photos | Vercel Blob |
| Identity | An httpOnly cookie the server sets. No login, no auth provider. |

---

## Deploy

### 1. Push to GitHub

```bash
cd pawlink-ai
git init
git add .
git commit -m "PawLink AI"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pawlink-ai.git
git push -u origin main
```

### 2. Import on Vercel

Sign in to [vercel.com](https://vercel.com) with GitHub. **Add New → Project**, pick the repo, **Import**. It detects Vite on its own, so leave the build settings alone.

Under **Environment Variables**, add one:

| Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | your key from [console.anthropic.com](https://console.anthropic.com) |

Optionally two more, which turn "Halston Park, near the ballfields" into a real distance in miles:

| Name | Value |
|---|---|
| `ENABLE_GEOCODING` | `true` |
| `GEOCODER_CONTACT` | your email, required by OpenStreetMap |

Deploy. The site goes live, but the board will not load yet. That is expected. Two clicks left.

### 3. Add the database and the photo store

Both live inside Vercel, under **Storage** in the sidebar.

1. **Create Database → Neon (Postgres)**. Name it, connect it to this project. Vercel injects `DATABASE_URL` for you.
2. **Create → Blob**. Connect it to this project. Vercel injects `BLOB_READ_WRITE_TOKEN` for you.

Then go to **Deployments → ⋯ → Redeploy**, because environment variables are only read at build time.

**There is no schema to run.** The tables build themselves on the first request that touches the database, and three sample found-pet reports get seeded so the board is not empty on day one. See `api/_lib/db.js`.

### 4. Try it

Open your URL. Go to **Lost + Found** and file a **lost dog** report with a photo. Three found reports are already on the board, one of them a reddish-tan dog with a white chest blaze. See what the matcher does with it.

---

## Run it locally

```bash
npm install
npm i -g vercel
vercel link          # connects this folder to your Vercel project
vercel env pull      # pulls the database and blob credentials into .env.local
npm run dev          # runs `vercel dev`: frontend and /api together
```

Open http://localhost:3000. Local dev talks to the same database as production, so anything you file locally shows up on the live board too.

---

## How it is put together

```
api/
  reports.js      GET the public board, POST a new report (photo goes to Blob)
  match.js        POST a report id, get scored candidates back
  pets.js         GET/POST private pet profiles, scoped to your cookie
  shelter.js      GET the adoption roster
  adopt.js        POST quiz answers, get ranked animals
  triage.js       POST a pet and a symptom, get an urgency read
  _lib/
    db.js         Postgres, and the schema that creates itself
    session.js    the cookie that stands in for accounts
    anthropic.js  the only file that touches your API key
    prompts.js    all three prompts, built server-side
    images.js     fetches photos from Blob, refuses anything else
    geocode.js    street names to miles, optional
    pets.js       the ten shelter animals
    rateLimit.js  best effort, per IP
src/              the React app
```

**Why the key stays on the server.** Ship an API key to the browser and anyone can open the network tab, copy it, and spend your money. Everything AI-related goes through `/api`, which runs on Vercel's machines. The browser never sees the key.

**Why the endpoints take data, not prompts.** `/api/match`, `/api/adopt`, and `/api/triage` accept structured fields and build the prompt themselves. If they accepted raw prompts, your key would be a free Claude proxy for whoever found it.

**Why photos get checked before fetching.** `images.js` verifies every photo URL sits on `*.public.blob.vercel-storage.com` before the server fetches it. Without that check, someone could hand the endpoint any URL and use your server to reach places it should not.

**Why there is no login.** A lost pet is a 2am problem, and making someone create an account before they can report a missing dog is a good way to lose the dog. The server drops a random id in an httpOnly cookie instead. Reports are public by design, since a lost and found where strangers cannot see each other's reports is not a lost and found. Health profiles are private, keyed to that cookie.

The trade: clear your cookies and your health profiles are gone. That is the right call for this, but `session.js` is the one file to replace if you ever want real accounts.

---

## Costs

- **Vercel Hobby**: free. 100 GB bandwidth, 1 GB Blob storage, a 300-second function ceiling. Hobby is for non-commercial use, so a free public service is fine, but the moment you charge for anything Vercel expects you on Pro.
- **Neon free plan**: free through Vercel, and generous.
- **Anthropic**: pay as you go. A match, a quiz, or a symptom check costs a fraction of a cent. Five dollars is thousands of requests.

Waiting on an AI response counts as I/O rather than CPU, so long AI calls barely touch your Vercel compute allowance.

---

## What to build next

- **Notify on a match.** When a new found report scores above 70 against an open lost report, email the owner. A cron function plus Resend.
- **Close the loop.** A "reunited" button that flips `status` to `resolved`, and a count of reunions on the home page. That number is the point of the whole site.
- **Real shelters.** `api/_lib/pets.js` is a hardcoded array. Move it to a table or a partner's API and the quiz keeps working unchanged.
- **Moderation.** Anyone can upload a photo to a public board right now. Screen uploads before they appear.
- **Real rate limiting.** `rateLimit.js` holds state in one warm function instance, so it is best effort. Swap in Upstash when the traffic justifies it.

---

## On the health tool

It does not diagnose, and it says so in the interface and in the prompt. It answers the question owners actually have at 2am: is this a wait-and-see or a get-in-the-car? If you extend it, keep that boundary. A confident wrong answer about a sick animal is worse than no answer.
