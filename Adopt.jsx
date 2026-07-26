import React, { useRef } from "react";

export const INK = "#12312A";
export const SEARCH = "#E8552C"; // Lost + Found
export const TENNIS = "#C4E15C"; // Adopt
export const CHART = "#3E7CB1"; // Health
export const ALARM = "#B33A2B";

/** A segmented ring. Reads like a gauge, not a pie chart. */
export function Dial({ pct, color }) {
  const segs = 28;
  const on = Math.round((Math.max(0, Math.min(100, pct)) / 100) * segs);
  const R = 46, cx = 56, cy = 56;

  return (
    <svg viewBox="0 0 112 112" className="dial" role="img" aria-label={`${pct} percent`}>
      {Array.from({ length: segs }).map((_, i) => {
        const a = (i / segs) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * (R - 9)} y1={cy + Math.sin(a) * (R - 9)}
            x2={cx + Math.cos(a) * R}       y2={cy + Math.sin(a) * R}
            stroke={i < on ? color : "rgba(18,49,42,0.15)"}
            strokeWidth="4"
          />
        );
      })}
      <text x="56" y="62" textAnchor="middle" className="dial-num">{pct}</text>
      <text x="56" y="76" textAnchor="middle" className="dial-pct">PERCENT</text>
    </svg>
  );
}

export function Bar({ label, value, color }) {
  const v = Math.round(Math.max(0, Math.min(100, value ?? 0)));
  return (
    <div className="bar">
      <span className="bar-l">{label}</span>
      <span className="bar-t"><span className="bar-f" style={{ width: `${Math.max(2, v)}%`, background: color }} /></span>
      <span className="bar-v">{v}</span>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-l">{label}{hint ? <em> {hint}</em> : null}</span>
      {children}
    </label>
  );
}

export function PhotoPicker({ preview, onPick, color, label }) {
  const ref = useRef(null);
  return (
    <div className="shot">
      <div className="shot-box" style={{ borderColor: preview ? color : "rgba(18,49,42,0.35)" }}>
        {preview
          ? <img src={preview} alt="The pet in this report" />
          : <span className="shot-empty">No photo yet</span>}
      </div>
      <div className="shot-side">
        <button type="button" className="btn btn-ghost" onClick={() => ref.current?.click()}>
          {preview ? "Replace photo" : label}
        </button>
        <p className="mono tiny">A clear, well lit shot of the face and body gives the strongest match.</p>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export function Loading({ text, color }) {
  return (
    <div className="loading" role="status">
      <span className="pads">
        {[0, 1, 2].map((i) => (
          <span key={i} className="pad" style={{ background: color, animationDelay: `${i * 0.16}s` }} />
        ))}
      </span>
      <span className="mono">{text}</span>
    </div>
  );
}

export function Err({ msg }) {
  return msg ? <p className="err mono" role="alert">{msg}</p> : null;
}

export function ToolHead({ eyebrow, title, lede, color }) {
  return (
    <header className="toolhead">
      <span className="mono eyebrow" style={{ color }}>{eyebrow}</span>
      <h2>{title}</h2>
      <p className="lede">{lede}</p>
      <span className="rule" style={{ background: color }} />
    </header>
  );
}
