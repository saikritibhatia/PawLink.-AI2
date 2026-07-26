import React from "react";
import { SEARCH, TENNIS, CHART } from "./ui.jsx";

const TOOLS = [
  {
    key: "lostfound", name: "Lost + Found matching", color: SEARCH,
    problem: "About 10 million pets go missing in the US each year.",
    solution: "Owners file a lost report, finders file a found report, and PawLink compares coat, markings, size, breed features, distance, and timeline to rank the likely matches with a similarity score.",
    action: "Open a case",
  },
  {
    key: "adopt", name: "Adoption compatibility", color: TENNIS,
    problem: "People adopt on appearance, then find the personality does not fit their life.",
    solution: "Nine questions about your home, hours, experience, and household. PawLink ranks shelter animals against the way you actually live and writes out why each one fits, and where it will not.",
    action: "Take the quiz",
  },
  {
    key: "health", name: "PawLink Health", color: CHART,
    problem: "Owners rarely know whether something is serious or what to do next.",
    solution: "Keep a profile for your pet. When something changes, describe it. PawLink weighs it against breed, age, weight, allergies, and conditions, and tells you how urgently to act. It does not replace a vet.",
    action: "Build a profile",
  },
];

export default function Home({ go, counts }) {
  return (
    <div>
      <section className="hero">
        <div>
          <span className="mono eyebrow">PawLink AI</span>
          <h1>
            Helping pets find their way home<span className="dash">,</span>
            <em>and stay healthy for life.</em>
          </h1>
          <p className="lede">
            Three tools for the three moments that matter: the day they vanish, the day you choose one,
            and the day something seems wrong.
          </p>
          <div className="row">
            <button className="btn" style={{ background: SEARCH, borderColor: SEARCH }} onClick={() => go("lostfound")}>
              Report a lost pet
            </button>
            <button className="btn btn-ghost" onClick={() => go("adopt")}>Find a pet that fits</button>
          </div>
        </div>

        {/* The signature: a flyer off a telephone pole, tear-off tabs and all. */}
        <div className="flyer">
          <div className="flyer-hole" />
          <span className="mono flyer-tag">COMMUNITY CASE BOARD</span>
          <h2 className="flyer-h">MISSING</h2>
          <p className="flyer-n mono">
            {counts.lost} lost · {counts.found} found · {counts.lost + counts.found} on the board
          </p>
          <p className="flyer-p">
            Two people usually hold the answer between them. One is looking. One is holding a leash.
            PawLink is what puts them in the same place.
          </p>
          <div className="tearoffs">
            {Array.from({ length: 7 }).map((_, i) => (
              <button key={i} className="tear" onClick={() => go("lostfound")} aria-label="Go to lost and found">
                <span>PAWLINK</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="tools">
        {TOOLS.map((t) => (
          <article key={t.key} className="tool" style={{ borderTopColor: t.color }}>
            <span className="dot" style={{ background: t.color }} />
            <h3>{t.name}</h3>
            <p className="tool-p"><strong>The problem.</strong> {t.problem}</p>
            <p className="tool-s">{t.solution}</p>
            <button className="btn btn-ghost sm" onClick={() => go(t.key)}>{t.action} →</button>
          </article>
        ))}
      </section>

      <p className="tiny foot center">
        PawLink Health is a guide, not a veterinarian. Matches are leads, not confirmations.
        Always confirm a pet's identity in person before handing it over.
      </p>
    </div>
  );
}
