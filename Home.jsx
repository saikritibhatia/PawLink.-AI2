import React, { useEffect, useState } from "react";
import { Dial, Field, Loading, Err, ToolHead, TENNIS, INK } from "./ui.jsx";
import { QUIZ } from "../data/quiz.js";
import { runAdoptQuiz, fetchRoster } from "../lib/api.js";

export default function Adopt() {
  const [roster, setRoster] = useState([]);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchRoster().then(setRoster).catch(() => setRoster([]));
  }, []);

  const total = QUIZ.length;
  const q = step >= 0 && step < total ? QUIZ[step] : null;

  const choose = (opt) => {
    setAnswers({ ...answers, [QUIZ[step].key]: opt });
    setTimeout(() => setStep((s) => s + 1), 140);
  };

  const run = async () => {
    setBusy(true);
    setErr("");
    try {
      // Send the questions as text so the server sees what was actually asked.
      const asked = Object.fromEntries(QUIZ.map((x) => [x.q, answers[x.key]]));
      setResult(await runAdoptQuiz(asked, note));
      setStep(total);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    setStep(-1); setAnswers({}); setNote(""); setResult(null); setErr("");
  };

  return (
    <div>
      <ToolHead
        color={TENNIS}
        eyebrow="Tool two"
        title="Adoption compatibility"
        lede="A dog that looks perfect on a kennel card can be the wrong dog for your Tuesday. Answer nine questions about how you actually live, and PawLink ranks the animals in our partner shelters against it, with the reasons written out."
      />

      {step === -1 && (
        <div className="card wide">
          <span className="mono stamp">NINE QUESTIONS, ABOUT TWO MINUTES</span>
          <p className="lede-sm">
            No question is about what breed you like the look of. Every question is about hours, space, noise,
            and patience, because that is what an animal actually lives inside of.
          </p>
          <div className="roster">
            {roster.map((p) => (
              <span key={p.id} className="chip">{p.name} <em>{p.species}</em></span>
            ))}
          </div>
          <button className="btn" style={{ background: TENNIS, borderColor: INK, color: INK }} onClick={() => setStep(0)}>
            Start the quiz
          </button>
        </div>
      )}

      {q && (
        <div className="card wide">
          <div className="quiz-top">
            <span className="mono stamp">
              Q{String(step + 1).padStart(2, "0")} <em>/ {String(total).padStart(2, "0")}</em>
            </span>
            <span className="prog">
              <span className="prog-f" style={{ width: `${(step / total) * 100}%`, background: TENNIS }} />
            </span>
          </div>

          <h3 className="quiz-q">{q.q}</h3>

          <div className="opts">
            {q.opts.map((o) => (
              <button
                key={o}
                className="opt"
                style={answers[q.key] === o ? { borderColor: INK, background: TENNIS } : null}
                onClick={() => choose(o)}
              >
                {o}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button className="btn btn-ghost sm" onClick={() => setStep(step - 1)}>Back</button>
          )}
        </div>
      )}

      {step === total && !result && (
        <div className="card wide">
          <span className="mono stamp">LAST THING, OPTIONAL</span>
          <Field label="Anything the questions missed?" hint="allergies, travel, a landlord rule, a past pet">
            <textarea
              className="in ta"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="I travel one weekend a month and my building has a 30 lb limit."
            />
          </Field>
          <Err msg={err} />
          {busy ? (
            <Loading text="Weighing energy, hours alone, experience, household" color={TENNIS} />
          ) : (
            <div className="row">
              <button className="btn" style={{ background: TENNIS, borderColor: INK, color: INK }} onClick={run}>
                Find my matches
              </button>
              <button className="btn btn-ghost" onClick={() => setStep(total - 1)}>Back</button>
            </div>
          )}
        </div>
      )}

      {result && (
        <div>
          <div className="card wide topcard">
            <span className="mono stamp">BEST MATCH</span>
            <p className="lede-sm">{result.summary}</p>
          </div>

          <div className="grid-2">
            {(result.matches || []).map((m) => (
              <div
                key={m.id}
                className="match"
                style={m.id === result.topPick ? { borderColor: INK, borderWidth: 2 } : null}
              >
                <div className="match-head">
                  <Dial pct={Math.round(m.compatibility)} color={TENNIS} />
                  <div>
                    {m.id === result.topPick && (
                      <span className="pill" style={{ background: TENNIS, color: INK }}>Top pick</span>
                    )}
                    <h4>{m.pet.name}</h4>
                    <p className="mono tiny">
                      {m.pet.breed} • {m.pet.age} • {m.pet.weight} • {m.pet.energy} energy
                    </p>
                    <p className="mono tiny">{m.pet.shelter}</p>
                  </div>
                </div>
                <p className="reason">{m.pet.profile}</p>
                <p className="fit"><strong>Why it fits you.</strong> {m.fit}</p>
                <p className="next mono">WORTH KNOWING → {m.watch}</p>
              </div>
            ))}
          </div>

          <button className="btn btn-ghost" onClick={restart}>Take the quiz again</button>
        </div>
      )}
    </div>
  );
}
