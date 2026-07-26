import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) console.error("No database URL. Add a Neon store in Vercel's Storage tab.");

export const sql = neon(url);

/**
 * The tables build themselves on the first request that touches the database.
 * No SQL editor, no migration step, nothing to paste anywhere. The promise is
 * cached, so a warm function skips it entirely.
 */
let ready = null;

export function ensureSchema() {
  if (ready) return ready;

  ready = (async () => {
    await sql`
      create table if not exists reports (
        id           uuid primary key default gen_random_uuid(),
        case_id      text not null,
        kind         text not null check (kind in ('lost','found')),
        name         text,
        animal_type  text not null,
        location     text not null,
        event_date   date,
        description  text not null,
        photo_url    text,
        contact      text,
        device_id    uuid not null,
        status       text not null default 'open',
        created_at   timestamptz not null default now()
      )`;

    await sql`
      create index if not exists reports_lookup
      on reports (kind, animal_type, created_at desc)`;

    await sql`
      create table if not exists pets (
        id          uuid primary key default gen_random_uuid(),
        device_id   uuid not null,
        name        text not null,
        species     text not null default 'Dog',
        breed       text not null,
        age         text,
        weight      text,
        color       text,
        allergies   text,
        conditions  text,
        meds        text,
        baseline    text,
        created_at  timestamptz not null default now()
      )`;

    await sql`create index if not exists pets_owner on pets (device_id, created_at desc)`;

    // Three found reports so the board is not empty on launch day and the
    // matcher has something to chew on. Delete the rows once real ones arrive.
    const [{ count }] = await sql`select count(*)::int as count from reports`;
    if (count === 0) {
      const nobody = "00000000-0000-0000-0000-000000000000";
      await sql`
        insert into reports (case_id, kind, animal_type, location, event_date, description, device_id)
        values
          ('FD-0417','found','Cat','Behind the laundromat on Sycamore and 4th','2026-07-06',
           'Young brown tabby, thin, very vocal. Dark M shape on the forehead, four white socks, white chin. No collar. Slight limp on the back left leg. Let me pick her up right away.',
           ${nobody}::uuid),
          ('FD-0418','found','Dog','Wandering the north end of Halston Park, near the ballfields','2026-07-08',
           'Medium build, maybe 45 lb, short reddish-tan coat with a white blaze down the chest. Floppy ears, black muzzle. Wearing a faded blue collar with no tags. Friendly but nervous around bikes.',
           ${nobody}::uuid),
          ('FD-0419','found','Dog','Front porch on Elm Street, two blocks from the elementary school','2026-07-10',
           'Small senior dog, about 18 lb, long low body, tricolor: black saddle, tan legs, white belly. Cloudy eyes, gray around the muzzle. Very calm, sat down as soon as I opened the door.',
           ${nobody}::uuid)`;
    }
  })();

  return ready;
}
