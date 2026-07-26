/* ============================================================
   PawLink AI
   Palette: deep pine ink on kennel-card paper.
   Each tool owns one signal color, so you always know where you are:
   search orange (lost + found), tennis chartreuse (adopt), chart blue (health).
   Display: Anton. Body: Karla. Data and labels: Space Mono.
   ============================================================ */

:root {
  --ink: #12312A;
  --soft: #4A6B60;
  --paper: #EDF1EC;
  --deep: #DFE7E1;
  --white: #FBFCFA;
  --search: #E8552C;
  --tennis: #C4E15C;
  --chart: #3E7CB1;
  --alarm: #B33A2B;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: "Karla", system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { margin: 0; }
p { margin: 0 0 10px; }
code { font-family: "Space Mono", monospace; font-size: 13px; background: var(--deep); padding: 1px 4px; }

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--ink);
  outline-offset: 2px;
}

.pl { min-height: 100vh; display: flex; flex-direction: column; }
.mono { font-family: "Space Mono", ui-monospace, monospace; }
.tiny { font-size: 11.5px; letter-spacing: .02em; color: var(--soft); line-height: 1.5; }
.stamp { font-size: 11px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; display: block; margin-bottom: 10px; }
.eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; display: block; margin-bottom: 14px; }
.center { text-align: center; }

/* ---------- chrome ---------- */
.topbar {
  position: sticky; top: 0; z-index: 20;
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  padding: 14px 24px;
  background: var(--paper);
  border-bottom: 1px solid var(--ink);
}
.brand { display: flex; align-items: center; gap: 10px; }
.brand b {
  font-family: "Anton", Impact, sans-serif; font-weight: 400;
  font-size: 22px; letter-spacing: .06em; text-transform: uppercase;
}
.brand span { font-size: 11px; color: var(--soft); max-width: 230px; line-height: 1.35; }

.nav { display: flex; gap: 2px; }
.nav button {
  font-family: "Space Mono", monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
  background: none; border: 1px solid transparent; padding: 7px 12px; cursor: pointer; color: var(--soft);
}
.nav button:hover { color: var(--ink); }
.nav button.on { color: var(--ink); border-color: var(--ink); background: var(--white); }

.wrap { flex: 1; width: 100%; max-width: 1160px; margin: 0 auto; padding: 44px 24px 90px; }

.sitefoot {
  display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  padding: 18px 24px; border-top: 1px solid var(--ink);
}

/* ---------- hero ---------- */
.hero {
  display: grid; grid-template-columns: 1.15fr .85fr; gap: 56px; align-items: center;
  padding-bottom: 60px;
}
.hero h1 {
  font-family: "Anton", Impact, sans-serif; font-weight: 400; text-transform: uppercase;
  font-size: clamp(38px, 5.2vw, 68px); line-height: .94; letter-spacing: .005em; margin-bottom: 20px;
}
.hero h1 em { font-style: normal; color: var(--soft); display: block; }
.dash { color: var(--soft); }
.lede { font-size: 17px; max-width: 52ch; margin-bottom: 22px; }
.lede-sm { font-size: 15px; color: var(--soft); max-width: 62ch; }

/* the signature: a flyer with tear-off tabs */
.flyer {
  position: relative; background: var(--white); border: 1px solid var(--ink);
  padding: 26px 24px 0; box-shadow: 7px 7px 0 rgba(18, 49, 42, .14);
}
.flyer-hole {
  position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
  width: 16px; height: 16px; border: 1px solid var(--ink); border-radius: 50%; background: var(--paper);
}
.flyer-tag { display: block; margin-top: 8px; font-size: 10px; letter-spacing: .18em; color: var(--soft); }
.flyer-h {
  font-family: "Anton", sans-serif; font-weight: 400; color: var(--search);
  font-size: clamp(46px, 7vw, 76px); line-height: 1; letter-spacing: .02em; margin: 6px 0 4px;
}
.flyer-n { font-size: 12px; letter-spacing: .06em; margin-bottom: 12px; }
.flyer-p { font-size: 14px; color: var(--soft); }

.tearoffs { display: flex; border-top: 1px dashed var(--ink); margin-top: 18px; }
.tear {
  flex: 1; height: 66px; padding: 0; cursor: pointer;
  border: none; border-left: 1px dashed var(--ink); background: none;
  transition: transform .18s ease, background .18s ease;
}
.tear:first-child { border-left: none; }
.tear span {
  font-family: "Space Mono", monospace; font-size: 9px; letter-spacing: .1em; color: var(--soft);
  writing-mode: vertical-rl; transform: rotate(180deg);
}
.tear:hover { transform: translateY(6px); background: var(--search); }
.tear:hover span { color: var(--white); }

/* ---------- tool cards ---------- */
.tools {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
  border-top: 1px solid var(--ink); padding-top: 36px;
}
.tool {
  display: flex; flex-direction: column;
  background: var(--white); border: 1px solid var(--ink); border-top: 5px solid; padding: 22px 20px;
}
.tool .dot { display: block; width: 9px; height: 9px; border-radius: 50%; margin-bottom: 14px; }
.tool h3 {
  font-family: "Anton", sans-serif; font-weight: 400; text-transform: uppercase;
  font-size: 22px; letter-spacing: .03em; margin-bottom: 12px;
}
.tool-p { font-size: 14px; color: var(--soft); }
.tool-s { font-size: 14px; flex: 1; }

/* ---------- tool header ---------- */
.toolhead { position: relative; padding-bottom: 26px; margin-bottom: 26px; }
.toolhead h2 {
  font-family: "Anton", sans-serif; font-weight: 400; text-transform: uppercase;
  font-size: clamp(30px, 4vw, 50px); line-height: 1; letter-spacing: .01em; margin-bottom: 16px;
}
.toolhead .amp { color: var(--search); }
.rule { position: absolute; bottom: 0; left: 0; width: 90px; height: 4px; }

/* ---------- tabs and layout ---------- */
.tabs { display: flex; flex-wrap: wrap; margin-bottom: 26px; }
.tab {
  font-family: "Space Mono", monospace; font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
  background: var(--white); color: var(--ink);
  border: 1px solid var(--ink); border-right: none; padding: 10px 16px; cursor: pointer;
}
.tab:last-child { border-right: 1px solid var(--ink); }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; align-items: start; }
.grid-2.tight { gap: 0 16px; }
.card { background: var(--white); border: 1px solid var(--ink); padding: 22px; }
.card.wide { margin-bottom: 22px; }
.card-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 6px; }
.row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

/* ---------- forms ---------- */
.field { display: block; margin-bottom: 16px; }
.field-l {
  display: block; margin-bottom: 6px;
  font-family: "Space Mono", monospace; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase;
}
.field-l em { font-style: normal; color: var(--soft); text-transform: none; letter-spacing: .02em; }

.in {
  width: 100%; padding: 11px 12px;
  background: var(--paper); border: 1px solid rgba(18, 49, 42, .35); color: var(--ink);
  font-family: "Karla", sans-serif; font-size: 15px;
}
.in:focus { border-color: var(--ink); background: var(--white); }
.ta { resize: vertical; line-height: 1.5; }

.btn {
  font-family: "Space Mono", monospace; font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase;
  background: var(--ink); color: var(--white); border: 1px solid var(--ink);
  padding: 12px 18px; cursor: pointer; transition: transform .12s ease, box-shadow .12s ease;
}
.btn:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 rgba(18, 49, 42, .25); }
.btn:disabled { opacity: .5; cursor: wait; transform: none; box-shadow: none; }
.btn-ghost { background: none; color: var(--ink); }
.btn.sm { padding: 8px 12px; font-size: 10.5px; align-self: flex-start; }

/* ---------- photo ---------- */
.shot { display: grid; grid-template-columns: 118px 1fr; gap: 14px; align-items: start; margin-bottom: 18px; }
.shot-box {
  height: 118px; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: var(--paper); border: 2px dashed;
}
.shot-box img { width: 100%; height: 100%; object-fit: cover; }
.shot-empty { font-family: "Space Mono", monospace; font-size: 10px; letter-spacing: .06em; color: var(--soft); }
.shot-side { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }

/* ---------- results ---------- */
.empty { background: rgba(255, 255, 255, .5); border: 1px dashed rgba(18, 49, 42, .45); padding: 22px; }
.ticks { list-style: none; padding: 0; margin: 0 0 10px; }
.ticks li {
  position: relative; padding: 5px 0 5px 18px; font-size: 14px;
  border-bottom: 1px solid rgba(18, 49, 42, .09);
}
.ticks li::before { content: "›"; position: absolute; left: 2px; color: var(--soft); font-family: "Space Mono", monospace; }
.ticks.red li::before { content: "!"; color: var(--alarm); font-weight: 700; }

.results > * { margin-bottom: 16px; }
.match { background: var(--white); border: 1px solid var(--ink); padding: 20px; margin-bottom: 16px; }
.match-head { display: grid; grid-template-columns: 86px 1fr; gap: 16px; align-items: center; margin-bottom: 14px; }
.match-head h4 {
  font-family: "Anton", sans-serif; font-weight: 400; text-transform: uppercase;
  font-size: 21px; letter-spacing: .03em; margin: 4px 0 2px;
}
.match-shot {
  display: block; width: 100%; max-height: 190px; object-fit: cover;
  border: 1px solid var(--ink); margin-bottom: 14px;
}

.dial { width: 86px; height: 86px; }
.dial-num { font-family: "Anton", sans-serif; font-size: 30px; fill: var(--ink); }
.dial-pct { font-family: "Space Mono", monospace; font-size: 7px; letter-spacing: .14em; fill: var(--soft); }

.pill {
  display: inline-block; padding: 3px 8px; color: var(--white);
  font-family: "Space Mono", monospace; font-size: 9.5px; letter-spacing: .1em; text-transform: uppercase;
}
.pill.sm { font-size: 9px; padding: 2px 6px; }

.bars { margin-bottom: 14px; }
.bar { display: grid; grid-template-columns: 104px 1fr 26px; gap: 8px; align-items: center; margin-bottom: 5px; }
.bar-l {
  font-family: "Space Mono", monospace; font-size: 9.5px; letter-spacing: .06em;
  text-transform: uppercase; color: var(--soft);
}
.bar-t { display: block; height: 7px; background: var(--deep); }
.bar-f { display: block; height: 7px; transition: width .5s ease; }
.bar-v { font-family: "Space Mono", monospace; font-size: 10px; text-align: right; }

.reason, .fit { font-size: 14.5px; }
.next {
  margin: 0; padding-top: 10px; font-size: 10.5px; letter-spacing: .06em; color: var(--soft);
  border-top: 1px solid rgba(18, 49, 42, .15);
}

/* ---------- case board ---------- */
.case {
  position: relative; display: grid; grid-template-columns: 78px 1fr; gap: 14px;
  background: var(--white); border: 1px solid var(--ink); padding: 14px; margin-bottom: 12px;
}
.case-hole {
  position: absolute; top: 6px; right: 8px;
  width: 11px; height: 11px; border: 1px solid var(--ink); border-radius: 50%;
}
.case-shot { width: 78px; height: 78px; object-fit: cover; border: 1px solid var(--ink); }
.case-shot.noshot {
  display: flex; align-items: center; justify-content: center;
  background: var(--deep); color: var(--soft); font-size: 8.5px; letter-spacing: .08em;
}
.case-body h4 {
  font-family: "Anton", sans-serif; font-weight: 400; text-transform: uppercase;
  font-size: 17px; letter-spacing: .03em; margin: 3px 0;
}
.case-desc { margin: 6px 0 0; font-size: 13px; color: var(--soft); }

/* ---------- quiz ---------- */
.quiz-top { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.quiz-top .stamp { margin: 0; white-space: nowrap; }
.quiz-top em { font-style: normal; color: var(--soft); }
.prog { flex: 1; display: block; height: 3px; background: var(--deep); }
.prog-f { display: block; height: 3px; transition: width .3s ease; }
.quiz-q {
  font-family: "Anton", sans-serif; font-weight: 400; text-transform: uppercase;
  font-size: 27px; line-height: 1.1; letter-spacing: .02em; margin-bottom: 18px;
}
.opts { display: grid; gap: 8px; margin-bottom: 16px; }
.opt {
  text-align: left; padding: 13px 15px; cursor: pointer;
  background: var(--paper); border: 1px solid rgba(18, 49, 42, .3); color: var(--ink);
  font-family: "Karla", sans-serif; font-size: 15px; transition: transform .12s ease, border-color .12s ease;
}
.opt:hover { border-color: var(--ink); transform: translateX(3px); }
.roster { display: flex; flex-wrap: wrap; gap: 6px; margin: 16px 0 20px; }
.chip {
  padding: 4px 9px; background: var(--paper); border: 1px solid rgba(18, 49, 42, .3);
  font-family: "Space Mono", monospace; font-size: 10.5px; letter-spacing: .04em;
}
.chip em { font-style: normal; color: var(--soft); }
.topcard { border-left: 5px solid var(--tennis); }

/* ---------- health ---------- */
.warn {
  background: var(--white); border: 1px solid var(--alarm); border-left: 5px solid var(--alarm);
  padding: 14px 16px; font-size: 13.5px; margin-bottom: 24px;
}
.mini { background: var(--paper); border: 1px solid rgba(18, 49, 42, .2); padding: 10px 12px; margin-bottom: 16px; }
.mini p { margin: 3px 0 0; }
.urg { background: var(--white); border: 1px solid; border-left-width: 6px; padding: 16px 18px; }
.urg-tag {
  display: inline-block; margin-bottom: 8px; padding: 3px 9px; color: #fff;
  font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
}
.urg-line { margin: 0; font-size: 17px; font-weight: 600; }
.block { background: var(--white); border: 1px solid var(--ink); padding: 18px; }
.block.flags { border-color: var(--alarm); }
.cause { border-top: 1px solid rgba(18, 49, 42, .12); padding: 10px 0 4px; }
.cause:first-of-type { border-top: none; padding-top: 0; }
.cause-h { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
.cause h4 { font-size: 16px; font-weight: 800; }
.cause p { font-size: 14px; color: var(--soft); }
.foot { border-top: 1px solid rgba(18, 49, 42, .2); padding-top: 12px; }

/* ---------- states ---------- */
.loading { display: flex; align-items: center; gap: 12px; border: 1px dashed rgba(18, 49, 42, .45); padding: 20px; }
.loading .mono { font-size: 11.5px; letter-spacing: .06em; color: var(--soft); }
.pads { display: flex; gap: 5px; }
.pad { display: block; width: 9px; height: 9px; border-radius: 50% 50% 45% 45%; animation: hop .9s infinite ease-in-out; }
@keyframes hop {
  0%, 100% { transform: translateY(0); opacity: .4; }
  40% { transform: translateY(-7px); opacity: 1; }
}
.err {
  margin-bottom: 12px; padding-left: 8px; font-size: 12px;
  color: var(--alarm); border-left: 3px solid var(--alarm);
}

/* ---------- responsive and motion ---------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; gap: 34px; }
  .tools { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .brand span { display: none; }
  .wrap { padding: 30px 18px 70px; }
  .topbar { padding: 12px 16px; }
  .nav { flex-wrap: wrap; }
}
