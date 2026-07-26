import React, { useEffect, useState } from "react";
import Home from "./components/Home.jsx";
import LostFound from "./components/LostFound.jsx";
import Adopt from "./components/Adopt.jsx";
import Health from "./components/Health.jsx";
import { SEARCH, TENNIS, CHART, INK } from "./components/ui.jsx";
import { listReports, listPets } from "./lib/api.js";

const NAV = [
  ["home", "Home"],
  ["lostfound", "Lost + Found"],
  ["adopt", "Adopt"],
  ["health", "Health"],
];

const ACCENT = { lostfound: SEARCH, adopt: TENNIS, health: CHART };

export default function App() {
  const [view, setView] = useState("home");
  const [reports, setReports] = useState([]);
  const [pets, setPets] = useState([]);
  const [boot, setBoot] = useState("loading"); // loading | ready | failed

  useEffect(() => {
    (async () => {
      try {
        const [r, p] = await Promise.all([listReports(), listPets()]);
        setReports(r);
        setPets(p);
        setBoot("ready");
      } catch (e) {
        console.error(e);
        setBoot("failed");
      }
    })();
  }, []);

  const accent = ACCENT[view] || INK;

  return (
    <div className="pl">
      <header className="topbar">
        <div className="brand">
          <b>PawLink<span style={{ color: accent }}>.</span>AI</b>
          <span>Helping pets find their way home, and stay healthy for life.</span>
        </div>
        <nav className="nav">
          {NAV.map(([k, label]) => (
            <button key={k} className={view === k ? "on" : ""} onClick={() => setView(k)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="wrap">
        {boot === "failed" && (
          <div className="empty">
            <p className="mono stamp">THE BOARD DID NOT LOAD</p>
            <p>
              The database did not answer. If you just deployed, check that a Neon store is connected
              to this project in Vercel's Storage tab, then reload.
            </p>
          </div>
        )}

        {boot === "loading" && (
          <div className="empty"><p className="mono">Loading the case board</p></div>
        )}

        {boot === "ready" && (
          <>
            {view === "home" && (
              <Home
                go={setView}
                counts={{
                  lost: reports.filter((r) => r.kind === "lost").length,
                  found: reports.filter((r) => r.kind === "found").length,
                }}
              />
            )}
            {view === "lostfound" && (
              <LostFound
                reports={reports}
                onNewReport={(r) => setReports((prev) => [r, ...prev])}
              />
            )}
            {view === "adopt" && <Adopt />}
            {view === "health" && (
              <Health pets={pets} onNewPet={(p) => setPets((prev) => [p, ...prev])} />
            )}
          </>
        )}
      </main>

      <footer className="sitefoot">
        <span className="mono tiny">PawLink AI</span>
        <span className="mono tiny">
          Guidance, not diagnosis. Matches are leads, not confirmations.
        </span>
      </footer>
    </div>
  );
}
