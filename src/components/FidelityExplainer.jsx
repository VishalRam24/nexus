import React, { useEffect, useState } from "react";

/**
 * Four-beat explainer for the component library, replacing a static tile grid:
 *
 *   0. 15 sectors            → the top-level split
 *   1. 223 components        → every sector bursts into its components
 *   2. one component         → zoom to a single real component
 *   3. the fidelity ladder   → what "multi-fidelity" actually means
 *
 * All counts and model names are the real ones from Energy_Components/.
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

// The real ladder under EC018_lfp_lithium_iron_phosphate.
const LADDER = [
  {
    id: "F0a",
    tier: "F0 · empirical",
    label: "Round-trip efficiency curve",
    note: "One lookup: efficiency vs C-rate. Cheapest, and enough for a capacity study.",
  },
  {
    id: "F1a",
    tier: "F1 · semi-empirical",
    label: "State of charge",
    note: "Energy in, energy out, SoC tracked over time.",
  },
  {
    id: "F1b",
    tier: "F1 · semi-empirical",
    label: "+ thermal",
    note: "SoC plus cell temperature — efficiency now moves with heat.",
  },
  {
    id: "F2a",
    tier: "F2 · lumped physics",
    label: "Equivalent circuit (1RC)",
    note: "An R–C network with real voltage dynamics. Most detail, most cost.",
  },
];

const PHASES = [
  { title: "15 sectors", sub: "Everything the library models, split once." },
  { title: "223 components", sub: "Each sector expands into individually modelled components." },
  { title: "One component", sub: "Take a single LFP battery cell out of the batteries sector." },
  { title: "Multiple fidelities", sub: "That one component exists at several levels of detail." },
];

const COLS = 5;
const CW = 84;
const CH = 62;
const X0 = 12;
const Y0 = 26;

function cell(i) {
  return { x: X0 + (i % COLS) * CW, y: Y0 + Math.floor(i / COLS) * CH };
}

/**
 * Deterministic dot positions inside a sector cell. Sized so the largest
 * sector (Thermal, 41) still fits under the label without spilling into the
 * row below: 9 per row at 6.2px pitch → 5 rows ≈ 31px in a 52px-tall cell.
 */
function dots(i, n) {
  const { x, y } = cell(i);
  const per = 9;
  const pitch = 6.2;
  return Array.from({ length: n }, (_, k) => ({
    cx: x + 10 + (k % per) * pitch,
    cy: y + 21 + Math.floor(k / per) * pitch,
  }));
}

/** Tiny illustration per fidelity level. */
function Sparkline({ id }) {
  const c = "#14b8a6";
  if (id === "F0a")
    return (
      <path d="M2 22 C 12 20, 22 16, 32 9 S 46 3, 52 2" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    );
  if (id === "F1a")
    return (
      <path d="M2 20 L14 6 L26 20 L38 6 L50 20" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    );
  if (id === "F1b")
    return (
      <>
        <path d="M2 20 L14 7 L26 20 L38 7 L50 20" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 23 C 16 21, 30 15, 52 10" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
      </>
    );
  // F2a — R–C equivalent circuit
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
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), phase === 3 ? 5200 : 3400);
    return () => clearTimeout(t);
  }, [phase, auto]);

  const show = (p) => {
    setAuto(false);
    setPhase(p);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
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

      <div className="relative" style={{ height: 232 }}>
        {/* Phases 0–1: the sector grid */}
        <svg
          viewBox="0 0 440 220"
          className="w-full absolute inset-0 transition-opacity duration-700"
          style={{ opacity: phase <= 1 ? 1 : 0 }}
          aria-hidden={phase > 1}
        >
          {SECTORS.map((s, i) => {
            const { x, y } = cell(i);
            return (
              <g key={s.name}>
                <rect
                  x={x} y={y} width={CW - 8} height={CH - 10} rx="6"
                  className="transition-all duration-700"
                  fill={phase === 0 ? "#14b8a6" : "#f2f4f8"}
                  opacity={phase === 0 ? (i % 3 === 0 ? 1 : i % 3 === 1 ? 0.82 : 0.66) : 1}
                />
                {/* Label sits centred in phase 0, but moves to the top edge in
                    phase 1 so the component dots have clear space beneath it. */}
                <text
                  x={x + (CW - 8) / 2} y={phase === 0 ? y + 26 : y + 12}
                  textAnchor="middle"
                  className="transition-all duration-700"
                  fontSize="8.5" fontWeight="600"
                  fill={phase === 0 ? "#ffffff" : "#6c7793"}
                >
                  {s.name}
                </text>
                <text
                  x={x + (CW - 8) / 2} y={y + 42}
                  textAnchor="middle" fontSize="11" fontWeight="700"
                  className="transition-opacity duration-500"
                  fill="#ffffff"
                  opacity={phase === 0 ? 0.9 : 0}
                >
                  {s.n}
                </text>
                {/* component dots */}
                {phase === 1 &&
                  dots(i, s.n).map((d, k) => (
                    <circle
                      key={k} cx={d.cx} cy={d.cy} r="2.1"
                      fill={i === 1 ? "#0d9488" : "#2dd4bf"}
                      opacity={i === 1 ? 1 : 0.8}
                    >
                      <animate
                        attributeName="r" from="0" to="2.1"
                        dur="0.4s" begin={`${k * 0.006}s`} fill="freeze"
                      />
                    </circle>
                  ))}
              </g>
            );
          })}
          <text x="220" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6c7793">
            {phase === 0 ? "15 SECTORS" : "223 COMPONENTS"}
          </text>
        </svg>

        {/* Phase 2: one component */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
          style={{ opacity: phase === 2 ? 1 : 0, pointerEvents: phase === 2 ? "auto" : "none" }}
          aria-hidden={phase !== 2}
        >
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-ink-400 font-bold mb-3">
              Batteries · lithium-ion
            </div>
            <div
              className="inline-block bg-ink-800 text-white rounded-lg px-8 py-6 shadow-xl transition-transform duration-700"
              style={{ transform: phase === 2 ? "scale(1)" : "scale(0.8)" }}
            >
              <div className="font-mono text-xs text-flux-400">EC018</div>
              <div className="text-2xl font-semibold mt-1">LFP battery</div>
              <div className="text-sm text-ink-400 mt-1">Lithium iron phosphate</div>
            </div>
            <div className="text-sm text-ink-500 mt-4">one of 26 in its sector</div>
          </div>
        </div>

        {/* Phase 3: the fidelity ladder */}
        <div
          className="absolute inset-0 transition-opacity duration-700 overflow-hidden"
          style={{ opacity: phase === 3 ? 1 : 0, pointerEvents: phase === 3 ? "auto" : "none" }}
          aria-hidden={phase !== 3}
        >
          <div className="text-xs uppercase tracking-widest text-ink-400 font-bold mb-2">
            EC018 LFP battery — same component, four models
          </div>
          <div className="space-y-1.5">
            {LADDER.map((f, i) => (
              <div
                key={f.id}
                className="flex items-center gap-3 bg-ink-100 rounded-md px-3 py-2 transition-all duration-500"
                style={{
                  transform: phase === 3 ? "translateX(0)" : "translateX(-12px)",
                  opacity: phase === 3 ? 1 : 0,
                  transitionDelay: `${i * 110}ms`,
                }}
              >
                <svg viewBox="0 0 54 26" className="w-12 h-6 flex-shrink-0">
                  <Sparkline id={f.id} />
                </svg>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-flux-700 leading-none">
                    {f.tier}
                  </div>
                  <div className="text-sm font-semibold text-ink-800 leading-tight mt-0.5 truncate">
                    {f.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-500 mt-2 leading-relaxed">
            Pick the cheapest level that still answers your question — per
            component, not per study.
          </p>
        </div>
      </div>
    </div>
  );
}
