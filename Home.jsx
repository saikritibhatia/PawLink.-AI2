import React, { useState } from "react";
import { Dial, Bar, Field, PhotoPicker, Loading, Err, ToolHead, SEARCH } from "./ui.jsx";
import { ANIMAL_TYPES } from "../data/quiz.js";
import { createReport, runMatch } from "../lib/api.js";
import { resizePhoto } from "../lib/image.js";

const BLANK = { name: "", animal_type: "Dog", location: "", event_date: "", description: "", contact: "" };

export default function LostFound({ reports, onNewReport }) {
  const [tab, setTab] = useState("lost");
  const [form, setForm] = useState(BLANK);
  const [photo, setPhoto] = useState(null); // { base64, previewUrl }
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [results, setResults] = useState(null);
  const [filed, setFiled] = useState(null);

  const isLost = tab === "lost";
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const reset = () => {
    setForm(BLANK); setPhoto(null); setResults(null); setFiled(null); setErr("");
  };

  const pickPhoto = async (file) => {
    setErr("");
    try {
      setPhoto(await resizePhoto(file));
    } catch (e) {
      setErr(e.message);
    }
  };

  const submit = async () => {
    setErr("");
    if (!form.location.trim() || !form.description.trim()) {
      setErr("Add the location and a description. Both do real work in the match.");
      return;
    }
    if (isLost && !form.name.trim()) {
      setErr("Add the pet's name so the case card reads properly.");
      return;
    }

    setResults(null);
    try {
      setBusy(photo ? "Uploading the photo and filing the report" : "Filing the report");
      const record = await createReport({
        ...form,
        kind: tab,
        name: isLost ? form.name.trim() : null,
        photo_base64: photo?.base64 ?? null,
      });
      onNewReport(record);
      setFiled(record);

      setBusy("Comparing coats, markings, distance, and timeline");
      setResults(await runMatch(record.id));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy("");
    }
  };

  const otherSide = reports.filter(
    (r) => r.kind === (isLost ? "found" : "lost") && r.animal_type === form.animal_type
  ).length;

  return (
    <div>
      <ToolHead
        color={SEARCH}
        eyebrow="Tool one"
        title={<>Lost <span className="amp">+</span> Found matching</>}
        lede="Roughly 10 million pets go missing in the United States every year. Two people usually hold the answer between them and never meet. PawLink reads both reports, compares the animals feature by feature, and puts a number on it."
      />

      <div className="tabs">
        {[["lost", "File a lost pet report"], ["found", "File a found pet report"], ["board", "Case board"]].map(([k, l]) => (
          <button
            key={k}
            className={`tab${tab === k ? " on" : ""}`}
            style={tab === k ? { background: SEARCH, borderColor: SEARCH, color: "#FBFCFA" } : null}
            onClick={() => { setTab(k); if (k !== "board") reset(); }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "board" ? (
        <CaseBoard reports={reports} />
      ) : (
        <div className="grid-2">
          <div className="card">
            <div className="card-top">
              <span className="mono stamp" style={{ color: SEARCH }}>
                {isLost ? "LOST PET REPORT" : "FOUND PET REPORT"}
              </span>
              <span className="mono tiny">
                {otherSide} matching {isLost ? "found" : "lost"} report{otherSide === 1 ? "" : "s"} on file
              </span>
            </div>

            <PhotoPicker
              preview={photo?.previewUrl}
              onPick={pickPhoto}
              color={SEARCH}
              label={isLost ? "Upload a photo of your pet" : "Upload a photo of the pet you found"}
            />

            {isLost && (
              <Field label="Pet name">
                <input className="in" value={form.name} onChange={set("name")} placeholder="Biscuit" />
              </Field>
            )}

            <Field label="Animal type">
              <select className="in" value={form.animal_type} onChange={set("animal_type")}>
                {ANIMAL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>

            <Field label={isLost ? "Last seen location" : "Location found"} hint="street, park, cross streets">
              <input
                className="in"
                value={form.location}
                onChange={set("location")}
                placeholder={isLost ? "Halston Park, near the ballfields" : "Elm Street, by the school"}
              />
            </Field>

            <Field label={isLost ? "Date missing" : "Date found"}>
              <input className="in" type="date" value={form.event_date} onChange={set("event_date")} />
            </Field>

            <Field label={isLost ? "Description" : "Observations and description"} hint="color, markings, size, collar, behavior">
              <textarea
                className="in ta"
                rows={5}
                value={form.description}
                onChange={set("description")}
                placeholder={isLost
                  ? "Reddish-tan short coat, white blaze on the chest, floppy ears, about 45 lb. Blue collar, no tags. Scared of bikes."
                  : "Reddish-tan short coat, white patch on chest, floppy ears, medium build. Faded blue collar. Nervous but let me leash him."}
              />
            </Field>

            <Field label="Contact" hint="optional, shown on your case card">
              <input className="in" value={form.contact} onChange={set("contact")} placeholder="555 0143 or you@email.com" />
            </Field>

            <Err msg={err} />
            <div className="row">
              <button
                className="btn"
                style={{ background: SEARCH, borderColor: SEARCH }}
                onClick={submit}
                disabled={Boolean(busy)}
              >
                {busy ? "Working" : isLost ? "File report and search found pets" : "File report and search lost pets"}
              </button>
              <button className="btn btn-ghost" onClick={reset} disabled={Boolean(busy)}>Clear</button>
            </div>
          </div>

          <div>
            {busy && <Loading text={busy} color={SEARCH} />}

            {!busy && results === null && (
              <div className="empty">
                <p className="mono stamp" style={{ color: SEARCH }}>WHAT THE MATCH LOOKS AT</p>
                <ul className="ticks">
                  <li>Coat color and where it changes</li>
                  <li>Markings: blaze, socks, mask, saddle, spots</li>
                  <li>Size and build against the reported weight</li>
                  <li>Breed-typical features: ear set, muzzle, coat length</li>
                  <li>Distance between the two locations</li>
                  <li>Whether the dates make sense for one animal on foot</li>
                </ul>
                <p className="tiny">
                  Every candidate comes back with a number, a plain-language reason, and one thing to check next.
                  A high score is a lead, never a confirmation. Always confirm identity in person.
                </p>
              </div>
            )}

            {!busy && results?.length === 0 && (
              <div className="empty">
                <p className="mono stamp" style={{ color: SEARCH }}>REPORT FILED, NO CANDIDATES YET</p>
                <p>
                  Case {filed?.case_id} is open on the board. No {isLost ? "found" : "lost"} reports for that
                  animal type are up yet. The moment one is filed, it gets compared against yours.
                </p>
              </div>
            )}

            {!busy && results?.length > 0 && (
              <div className="results">
                <p className="mono stamp" style={{ color: SEARCH }}>
                  CASE {filed?.case_id} • {results.length} CANDIDATE{results.length === 1 ? "" : "S"}
                </p>
                {results.map((m) => (
                  <div key={m.id} className="match">
                    <div className="match-head">
                      <Dial pct={Math.round(m.similarity)} color={SEARCH} />
                      <div>
                        <span className="pill" style={{ background: SEARCH }}>{m.verdict}</span>
                        <h4>{m.record.case_id}</h4>
                        <p className="mono tiny">
                          {m.record.kind === "found" ? "Found" : "Last seen"} at {m.record.location} • {fmt(m.record.event_date)}
                        </p>
                      </div>
                    </div>

                    {m.record.photo_url && (
                      <img className="match-shot" src={m.record.photo_url} alt="The reported pet" loading="lazy" />
                    )}

                    <div className="bars">
                      <Bar label="Color" value={m.breakdown?.color} color={SEARCH} />
                      <Bar label="Markings" value={m.breakdown?.pattern} color={SEARCH} />
                      <Bar label="Size and build" value={m.breakdown?.size} color={SEARCH} />
                      <Bar label="Breed features" value={m.breakdown?.breed} color={SEARCH} />
                      <Bar label="Distance" value={m.breakdown?.distance} color={SEARCH} />
                      <Bar label="Timeline" value={m.breakdown?.timeline} color={SEARCH} />
                    </div>

                    <p className="reason">{m.reasoning}</p>
                    {m.record.contact && (
                      <p className="tiny">Contact on this report: {m.record.contact}</p>
                    )}
                    <p className="next mono">CHECK NEXT → {m.checkNext}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Postgres returns dates as ISO strings. Show the day, not the timestamp. */
function fmt(d) {
  return d ? String(d).slice(0, 10) : "no date";
}

function CaseBoard({ reports }) {
  const Column = ({ title, list, empty }) => (
    <div>
      <p className="mono stamp" style={{ color: SEARCH }}>{title} • {list.length}</p>
      {list.length === 0 && <div className="empty"><p>{empty}</p></div>}
      {list.map((r) => (
        <article key={r.id} className="case">
          <div className="case-hole" />
          {r.photo_url
            ? <img src={r.photo_url} alt="" className="case-shot" loading="lazy" />
            : <div className="case-shot noshot mono">NO PHOTO</div>}
          <div className="case-body">
            <span className="mono tiny">{r.case_id} • {r.animal_type} • {fmt(r.event_date)}</span>
            <h4>{r.name || (r.kind === "found" ? "Unidentified" : "Unnamed")}</h4>
            <p className="tiny">{r.location}</p>
            <p className="case-desc">{r.description}</p>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="grid-2">
      <Column title="LOST" list={reports.filter((r) => r.kind === "lost")} empty="No lost reports filed yet." />
      <Column title="FOUND" list={reports.filter((r) => r.kind === "found")} empty="No found reports filed yet." />
    </div>
  );
}
