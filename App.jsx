import React, { useEffect, useState } from "react";
import { Field, Loading, Err, ToolHead, CHART, ALARM, INK } from "./ui.jsx";
import { DURATIONS, ANIMAL_TYPES } from "../data/quiz.js";
import { createPet, runTriage } from "../lib/api.js";

const BLANK = {
  name: "", species: "Dog", breed: "", age: "", weight: "",
  color: "", allergies: "", conditions: "", meds: "", baseline: "",
};

const URGENCY = {
  emergency: { color: ALARM,     label: "Emergency" },
  urgent:    { color: "#D2691E", label: "Urgent, today" },
  soon:      { color: "#B8860B", label: "Book a vet soon" },
  monitor:   { color: "#3F7A5E", label: "Monitor at home" },
};

export default function Health({ pets, onNewPet }) {
  const [mode, setMode] = useState(pets.length ? "check" : "profile");
  const [selected, setSelected] = useState(pets[0]?.id ?? null);
  const [draft, setDraft] = useState(BLANK);
  const [concern, setConcern] = useState("");
  const [since, setSince] = useState(DURATIONS[1]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [out, setOut] = useState(null);

  useEffect(() => {
    if (pets.length && !pets.some((p) => p.id === selected)) setSelected(pets[0].id);
  }, [pets, selected]);

  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });
  const pet = pets.find((p) => p.id === selected);

  const saveProfile = async () => {
    if (!draft.name.trim() || !draft.breed.trim()) {
      setErr("Name and breed are the minimum. Everything else sharpens the answer.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const saved = await createPet(draft);
      onNewPet(saved);
      setSelected(saved.id);
      setDraft(BLANK);
      setMode("check");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const check = async () => {
    if (!pet) { setErr("Pick a pet first."); return; }
    if (!concern.trim()) { setErr("Describe what you are seeing, in your own words."); return; }

    setBusy(true);
    setErr("");
    setOut(null);
    try {
      setOut(await runTriage(pet, concern, since));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const u = out ? URGENCY[out.urgency] || URGENCY.soon : null;

  return (
    <div>
      <ToolHead
        color={CHART}
        eyebrow="Tool three"
        title="PawLink Health"
        lede="Most owners are not deciding what is wrong. They are deciding whether this is a wait-and-see or a get-in-the-car. Keep a profile for your pet, describe what changed, and get a read on the difference."
      />

      <div className="warn">
        <strong>PawLink Health does not replace a veterinarian.</strong> It cannot examine, test, or diagnose your
        animal. It helps you understand what you are seeing and how urgently to act. When in doubt, call your vet or
        an emergency clinic.
      </div>

      <div className="tabs">
        {[["profile", "New pet profile"], ["check", "Check a symptom"]].map(([k, l]) => (
          <button
            key={k}
            className={`tab${mode === k ? " on" : ""}`}
            style={mode === k ? { background: CHART, borderColor: CHART, color: "#FBFCFA" } : null}
            onClick={() => setMode(k)}
          >
            {l}
          </button>
        ))}
      </div>

      {mode === "profile" && (
        <div className="card wide">
          <span className="mono stamp" style={{ color: CHART }}>PET PROFILE</span>
          <p className="lede-sm">
            This is the baseline every future symptom gets compared against. A twelve-year-old dachshund with a bad
            back and a two-year-old lab are not having the same limp.
          </p>

          <div className="grid-2 tight">
            <Field label="Name"><input className="in" value={draft.name} onChange={set("name")} placeholder="Biscuit" /></Field>
            <Field label="Species">
              <select className="in" value={draft.species} onChange={set("species")}>
                {ANIMAL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Breed"><input className="in" value={draft.breed} onChange={set("breed")} placeholder="Golden retriever mix" /></Field>
            <Field label="Age"><input className="in" value={draft.age} onChange={set("age")} placeholder="3 years" /></Field>
            <Field label="Weight"><input className="in" value={draft.weight} onChange={set("weight")} placeholder="62 lb" /></Field>
            <Field label="Color and markings"><input className="in" value={draft.color} onChange={set("color")} placeholder="Golden, white chest blaze" /></Field>
          </div>

          <Field label="Known allergies"><input className="in" value={draft.allergies} onChange={set("allergies")} placeholder="Chicken, bee stings" /></Field>
          <Field label="Existing conditions"><input className="in" value={draft.conditions} onChange={set("conditions")} placeholder="Mild hip dysplasia" /></Field>
          <Field label="Current medications"><input className="in" value={draft.meds} onChange={set("meds")} placeholder="Carprofen, 75 mg daily" /></Field>
          <Field label="Normal behavior" hint="what a good day looks like">
            <textarea
              className="in ta" rows={3} value={draft.baseline} onChange={set("baseline")}
              placeholder="Eats twice a day, sleeps through the night, two walks, always finishes his food."
            />
          </Field>

          <Err msg={err} />
          <button className="btn" style={{ background: CHART, borderColor: CHART }} onClick={saveProfile} disabled={busy}>
            {busy ? "Saving" : "Save profile"}
          </button>
        </div>
      )}

      {mode === "check" && (
        <div className="grid-2">
          <div className="card">
            <span className="mono stamp" style={{ color: CHART }}>SYMPTOM CHECK</span>

            {pets.length === 0 ? (
              <div className="empty">
                <p>No pet on file yet. Build a profile first, so the answer is about your animal and not a generic one.</p>
                <button className="btn btn-ghost" onClick={() => setMode("profile")}>Create a pet profile</button>
              </div>
            ) : (
              <>
                <Field label="Which pet?">
                  <select className="in" value={selected ?? ""} onChange={(e) => setSelected(e.target.value)}>
                    {pets.map((p) => <option key={p.id} value={p.id}>{p.name} • {p.breed}</option>)}
                  </select>
                </Field>

                {pet && (
                  <div className="mini">
                    <span className="mono tiny">ON FILE</span>
                    <p className="tiny">
                      {pet.species} • {pet.breed} • {pet.age || "age not given"} • {pet.weight || "weight not given"}
                    </p>
                    <p className="tiny">
                      Allergies: {pet.allergies || "none listed"}. Conditions: {pet.conditions || "none listed"}.
                      Meds: {pet.meds || "none listed"}.
                    </p>
                  </div>
                )}

                <Field label="What are you seeing?" hint="plain words are fine">
                  <textarea
                    className="in ta" rows={5} value={concern} onChange={(e) => setConcern(e.target.value)}
                    placeholder="He skipped dinner last night, keeps licking his back left paw, and the skin between his toes looks red and puffy."
                  />
                </Field>

                <Field label="How long has this been going on?">
                  <select className="in" value={since} onChange={(e) => setSince(e.target.value)}>
                    {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </Field>

                <Err msg={err} />
                <button className="btn" style={{ background: CHART, borderColor: CHART }} onClick={check} disabled={busy}>
                  {busy ? "Reading" : "Check this symptom"}
                </button>
              </>
            )}
          </div>

          <div>
            {busy && <Loading text="Comparing this against the profile on file" color={CHART} />}

            {!busy && !out && pets.length > 0 && (
              <div className="empty">
                <p className="mono stamp" style={{ color: CHART }}>WHAT YOU GET BACK</p>
                <ul className="ticks">
                  <li>How urgent this is, on a four-step scale</li>
                  <li>What on the profile changes the picture</li>
                  <li>Three or four things it could plausibly be</li>
                  <li>Red flags that mean go to a clinic now</li>
                  <li>Steps you can take today, and questions for the vet</li>
                </ul>
              </div>
            )}

            {out && u && pet && (
              <div className="results">
                <div className="urg" style={{ borderColor: u.color }}>
                  <span className="urg-tag mono" style={{ background: u.color }}>{u.label}</span>
                  <p className="urg-line">{out.urgencyLine}</p>
                </div>

                <div className="block">
                  <p className="mono stamp">{pet.name.toUpperCase()}'S PROFILE CHANGES THIS</p>
                  <ul className="ticks">
                    {(out.profileFactors || []).map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </div>

                <div className="block">
                  <p className="mono stamp">WHAT IT COULD BE</p>
                  {(out.possibleCauses || []).map((c, i) => (
                    <div key={i} className="cause">
                      <div className="cause-h">
                        <h4>{c.name}</h4>
                        <span
                          className="pill sm"
                          style={{
                            background:
                              c.likelihood === "More likely" ? CHART :
                              c.likelihood === "Possible" ? "#4A6B60" : "rgba(18,49,42,0.35)",
                          }}
                        >
                          {c.likelihood}
                        </span>
                      </div>
                      <p>{c.why}</p>
                    </div>
                  ))}
                </div>

                <div className="block flags">
                  <p className="mono stamp" style={{ color: ALARM }}>GO NOW IF YOU SEE</p>
                  <ul className="ticks red">
                    {(out.redFlags || []).map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </div>

                <div className="block">
                  <p className="mono stamp">WHAT TO DO TODAY</p>
                  <ul className="ticks">
                    {(out.nextSteps || []).map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </div>

                <div className="block">
                  <p className="mono stamp">ASK YOUR VET</p>
                  <ul className="ticks">
                    {(out.askYourVet || []).map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </div>

                <p className="tiny foot" style={{ color: INK }}>
                  This is guidance, not a diagnosis. A veterinarian is the only one who can examine {pet.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
