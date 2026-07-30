import React, { useEffect, useState } from "react";

/**
 * A four-beat zoom into the component library, replacing a static tile grid:
 *
 *   0. 15 sectors        — Batteries lit up among them
 *   1. inside Batteries  — the grid rushes past and its 26 chemistries fill the frame
 *   2. one chemistry     — zoom again onto the LFP cell
 *   3. its fidelities    — what "multi-fidelity" actually means
 *
 * Each beat is one continuous zoom rather than a cross-fade: the layer being
 * left behind scales up and fades out through the point of interest, while the
 * next layer scales in from that same point. `transformOrigin` per layer is
 * what makes it read as travelling inward instead of dissolving.
 *
 * Every count, name and model here is the real one from Energy_Components/.
 */

const SECTORS = [
  { name: "Hydrogen", n: 17 },
  { name: "Batteries", n: 26 },
  { name: "Solar", n: 18 },
  { name: "Wind", n: 6 },
  { name: "Thermal", n: 41 },
  { name: "Conventional", n: 13 },
  { name: "Mech. storage", n: 6 },
  { name: "Hydro & marine", n: 12 },
  { name: "Biomass", n: 11 },
  { name: "Geothermal", n: 6 },
  { name: "Power electronics", n: 32 },
  { name: "Gas systems", n: 9 },
  { name: "Carbon capture", n: 11 },
  { name: "Desalination", n: 7 },
  { name: "Thermoelectric", n: 8 },
];

const BATTERIES = 1; // index of the sector we zoom into

/** The real 26, grouped as they are on disk. */
const CHEMISTRIES = [
  {
    group: "Lithium-ion",
    items: ["LFP", "NMC", "NCA", "LTO", "LCO", "LMO", "Si anode", "Li-S", "Li-air", "Solid-state"],
  },
  {
    group: "Non-lithium",
    items: ["Lead-acid", "NiMH", "NiCd", "Na-ion", "Zn-air", "Fe-air", "Al-ion", "NaS"],
  },
  { group: "Flow", items: ["VRFB", "Zn-Br", "Fe-Cr", "Organic", "H-Br"] },
  { group: "Supercaps", items: ["EDLC", "Pseudo", "Hybrid"] },
];

/** The real ladder under EC018_lfp_lithium_iron_phosphate. */
const LADDER = [
  { id: "F0a", tier: "F0 · empirical", label: "Round-trip efficiency curve" },
  { id: "F1a", tier: "F1 · semi-empirical", label: "State of charge" },
  { id: "F1b", tier: "F1 · semi-empirical", label: "+ thermal" },
  { id: "F2a", tier: "F2 · lumped physics", label: "Equivalent circuit (1RC)" },
];

const PHASES = [
  { title: "15 sectors", sub: "Everything the library models, split once." },
  { title: "Inside batteries", sub: "26 chemistries — lithium-ion, non-lithium, flow cells, supercapacitors." },
  { title: "One chemistry", sub: "Take EC018, the lithium iron phosphate cell." },
  { title: "Multiple fidelities", sub: "That one cell exists at several levels of physics. Pick the cheapest that answers your question." },
];

const COLS = 5;
const CW = 84;
const CH = 62;
const X0 = 12;
const Y0 = 26;
const VB_W = 440;
const VB_H = 220;

const cell = (i) => ({
  x: X0 + (i % COLS) * CW,
  y: Y0 + Math.floor(i / COLS) * CH,
});

/** Centre of a sector tile as a transform-origin percentage. */
function tileOrigin(i) {
  const { x, y } = cell(i);
  return `${(((x + (CW - 8) / 2) / VB_W) * 100).toFixed(1)}% ${(
    ((y + (CH - 10) / 2) / VB_H) *
    100
  ).toFixed(1)}%`;
}

/**
 * Where a layer sits relative to the current beat:
 *   deeper than us  -> small and invisible, waiting to be reached
 *   the current one -> settled
 *   behind us       -> blown up and faded, we have flown through it
 */
function zoom(state, origin) {
  const scale = state === "current" ? 1 : state === "before" ? 0.28 : 3.4;
  return {
    transformOrigin: origin,
    transform: `scale(${scale})`,
    opacity: state === "current" ? 1 : 0,
    transition: "transform 800ms cubic-bezier(.22,.61,.36,1), opacity 700ms ease",
    pointerEvents: state === "current" ? "auto" : "none",
  };
}

const rel = (layer, phase) =>
  phase === layer ? "current" : phase < layer ? "before" : "after";

function Sparkline({ id }) {
  const c = "#14b8a6";
  if (id === "F0a")
    return <path d="M2 22 C 12 20, 22 16, 32 9 S 46 3, 52 2" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" />;
  if (id === "F1a")
    return <path d="M2 20 L14 6 L26 20 L38 6 L50 20" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />;
  if (id === "F1b")
    return (
      <>
        <path d="M2 20 L14 7 L26 20 L38 7 L50 20" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 23 C 16 21, 30 15, 52 10" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
      </>
    );
  return (
    <g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M2 12 h8 l3 -6 l4 12 l4 -12 l3 6 h6" />
      <path d="M30 12 h6 M42 12 h8" />
      <path d="M36 5 v14 M40 5 v14" />
    </g>
  );
}

export default function FidelityExplainer() {
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const hold = [3200, 4200, 3000, 5400][phase];
    const t = setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), hold);
    return () => clearTimeout(t);
  }, [phase, auto]);

  const show = (p) => {
    setAuto(false);
    setPhase(p);
  };

  const batteryOrigin = tileOrigin(BATTERIES);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 overflow-hidden">
      <div className="flex items-baseline justify-between mb-1">
        <h4 className="text-xl font-semibold text-ink-800">{PHASES[phase].title}</h4>
        <div className="flex gap-1.5">
          {PHASES.map((_, i) => (
            <button
              key={i}
              onClick={() => show(i)}
              aria-label={`Step ${i + 1}: ${PHASES[i].title}`}
              className={
                "h-1.5 rounded-full transition-all duration-300 " +
                (i === phase ? "w-6 bg-flux-500" : "w-1.5 bg-ink-300 hover:bg-ink-400")
              }
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-ink-500 mb-4 min-h-[2.5rem] leading-relaxed">
        {PHASES[phase].sub}
      </p>

      <div className="relative" style={{ minHeight: 232 }}>
        {/* ── Layer 0: the 15 sectors. In flow, so it sets the card's height. ── */}
        <div style={zoom(rel(0, phase), batteryOrigin)}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full block" aria-hidden={phase !== 0}>
            <text x={VB_W / 2} y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6c7793">
              15 SECTORS
            </text>
            {SECTORS.map((s, i) => {
              const { x, y } = cell(i);
              const lit = i === BATTERIES;
              return (
                <g key={s.name} opacity={lit ? 1 : 0.42}>
                  <rect
                    x={x} y={y} width={CW - 8} height={CH - 10} rx="6"
                    fill={lit ? "#0d9488" : "#14b8a6"}
                  />
                  <text
                    x={x + (CW - 8) / 2} y={y + 26} textAnchor="middle"
                    fontSize={s.name.length > 14 ? 7 : 8.5} fontWeight="600" fill="#ffffff"
                  >
                    {s.name}
                  </text>
                  <text
                    x={x + (CW - 8) / 2} y={y + 42} textAnchor="middle"
                    fontSize="11" fontWeight="700" fill="#ffffff" opacity="0.9"
                  >
                    {s.n}
                  </text>
                  {lit && (
                    <rect
                      x={x - 2.5} y={y - 2.5} width={CW - 3} height={CH - 5} rx="8"
                      fill="none" stroke="#0f766e" strokeWidth="1.6"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Layer 1: inside Batteries — the 26 chemistries ── */}
        <div className="absolute inset-0 flex flex-col justify-center" style={zoom(rel(1, phase), "14% 26%")} aria-hidden={phase !== 1}>
          <div className="text-xs uppercase tracking-widest text-ink-400 font-bold mb-2">
            Batteries · 26 components
          </div>
          <div className="space-y-1.5">
            {CHEMISTRIES.map((g) => (
              <div key={g.group}>
                <div className="text-[10px] font-mono text-flux-700 leading-none mb-1">
                  {g.group} · {g.items.length}
                </div>
                <div className="flex flex-wrap gap-1">
                  {g.items.map((c) => (
                    <span
                      key={c}
                      className={
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded " +
                        (c === "LFP"
                          ? "bg-flux-600 text-white"
                          : "bg-ink-100 text-ink-600")
                      }
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Layer 2: one chemistry ── */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={zoom(rel(2, phase), "50% 50%")}
          aria-hidden={phase !== 2}
        >
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-ink-400 font-bold mb-3">
              Batteries · lithium-ion
            </div>
            <div className="inline-block bg-ink-800 text-white rounded-lg px-8 py-6 shadow-xl">
              <div className="font-mono text-xs text-flux-400">EC018</div>
              <div className="text-2xl font-semibold mt-1">LFP battery</div>
              <div className="text-sm text-ink-400 mt-1">Lithium iron phosphate</div>
            </div>
            <div className="text-sm text-ink-500 mt-4">one of the 26</div>
          </div>
        </div>

        {/* ── Layer 3: the fidelity ladder ── */}
        <div className="absolute inset-0 flex flex-col justify-center" style={zoom(rel(3, phase), "50% 50%")} aria-hidden={phase !== 3}>
          <div className="text-xs uppercase tracking-widest text-ink-400 font-bold mb-2">
            EC018 LFP — same cell, four models
          </div>
          <div className="space-y-1.5">
            {LADDER.map((f) => (
              <div key={f.id} className="flex items-center gap-3 bg-ink-100 rounded-md px-3 py-2">
                <svg viewBox="0 0 54 26" className="w-12 h-6 flex-shrink-0">
                  <Sparkline id={f.id} />
                </svg>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-flux-700 leading-none">{f.tier}</div>
                  <div className="text-sm font-semibold text-ink-800 leading-tight mt-0.5 truncate">
                    {f.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
