import React, { useEffect, useRef, useState } from "react";

/**
 * Four beats through the component library, each with its own kind of motion:
 *
 *   0. 223 components   — one dot per component, in its sector
 *   1. 15 sectors       — the dots resolve into counts, in place (cross-fade)
 *   2. Inside batteries — the Batteries tile ZOOMS to fill the frame with its
 *                         26 chemistries
 *   3. Multiple fidelities — one chemistry SLIDES in sideways, showing its ladder
 *
 * Beats 0→1 deliberately do not move: it is the same grid, said two ways. The
 * zoom is reserved for going a level deeper, and the slide for stepping
 * sideways into a single item.
 *
 * A demo cursor drives it: it travels to the real Batteries tile and the real
 * LFP chip (measured with getBoundingClientRect, so it stays correct at any
 * width) and clicks them, and only then does the beat advance. Clicking a step
 * dot yourself takes over and retires the cursor.
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

const BATTERIES = 1; // the sector we zoom into

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
  { title: "223 components", sub: "One dot per modelled component, sitting in its sector." },
  { title: "15 sectors", sub: "The same thing as counts. Batteries holds 26 of them." },
  { title: "Inside batteries", sub: "26 chemistries — lithium-ion, non-lithium, flow cells, supercapacitors." },
  { title: "Multiple fidelities", sub: "Step into one — EC018, the LFP cell — and it exists at several levels of physics." },
];

const HOLD = [3600, 3200, 4200, 5600];

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

/**
 * Deterministic dot positions inside a sector cell. 9 per row at 6.2px pitch
 * keeps the largest sector (Thermal, 41) inside its 52px-tall tile.
 */
function dots(i, n) {
  const { x, y } = cell(i);
  return Array.from({ length: n }, (_, k) => ({
    cx: x + 10 + (k % 9) * 6.2,
    cy: y + 21 + Math.floor(k / 9) * 6.2,
  }));
}

/** Centre of a sector tile, as a transform-origin percentage. */
function tileOrigin(i) {
  const { x, y } = cell(i);
  const px = ((x + (CW - 8) / 2) / VB_W) * 100;
  const py = ((y + (CH - 10) / 2) / VB_H) * 100;
  return `${px.toFixed(1)}% ${py.toFixed(1)}%`;
}

const EASE = "cubic-bezier(.22,.61,.36,1)";
// One transform function list everywhere, so transitions interpolate cleanly
// instead of jumping when the mix of functions changes.
const T = (tx, s) => `translateX(${tx}) scale(${s})`;

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
  const [cursor, setCursor] = useState({ x: 0, y: 0, show: false });
  const [clicking, setClicking] = useState(false);

  const stageRef = useRef(null);
  const batteryRef = useRef(null);
  const lfpRef = useRef(null);

  /** Centre of a target element in stage-local pixels. */
  const centreOf = (ref) => {
    const stage = stageRef.current;
    const el = ref.current;
    if (!stage || !el) return null;
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
  };

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const hold = HOLD[phase];
    const timers = [];
    // Beats 0, 1 and 2 are advanced by a click on a real element; beat 3 just
    // holds, drops the cursor and loops.
    const target = phase === 2 ? lfpRef : phase < 2 ? batteryRef : null;

    if (target) {
      timers.push(
        setTimeout(() => {
          const c = centreOf(target);
          if (c) setCursor({ ...c, show: true });
        }, Math.max(200, hold - 1500))
      );
      timers.push(setTimeout(() => setClicking(true), hold - 420));
      timers.push(setTimeout(() => setClicking(false), hold - 140));
      timers.push(setTimeout(() => setPhase((p) => p + 1), hold));
    } else {
      timers.push(setTimeout(() => setCursor((c) => ({ ...c, show: false })), 700));
      timers.push(setTimeout(() => setPhase(0), hold));
    }
    return () => timers.forEach(clearTimeout);
  }, [phase, auto]);

  const show = (p) => {
    setAuto(false);
    setCursor((c) => ({ ...c, show: false }));
    setClicking(false);
    setPhase(p);
  };

  const showNumbers = phase >= 1;

  // Beats 0–1 hold still; from beat 2 the grid zooms through the Batteries tile.
  const gridStyle = {
    transformOrigin: tileOrigin(BATTERIES),
    transform: T("0", phase >= 2 ? 3.4 : 1),
    opacity: phase <= 1 ? 1 : 0,
    transition: `transform 850ms ${EASE}, opacity 650ms ease`,
    // Without this the zoomed-out grid still covers the card and swallows
    // clicks on the step dots, even at opacity 0.
    pointerEvents: phase <= 1 ? "auto" : "none",
  };

  // Zooms in from the Batteries tile, then slides out left when we step into a
  // single chemistry.
  const chemStyle = {
    transformOrigin: tileOrigin(BATTERIES),
    transform: phase < 2 ? T("0", 0.3) : phase === 2 ? T("0", 1) : T("-46%", 1),
    opacity: phase === 2 ? 1 : 0,
    transition: `transform 850ms ${EASE}, opacity 650ms ease`,
    pointerEvents: phase === 2 ? "auto" : "none",
  };

  // Waits off to the right, slides in — no zoom, so it reads as sideways.
  const ladderStyle = {
    transform: phase === 3 ? T("0", 1) : T("46%", 1),
    opacity: phase === 3 ? 1 : 0,
    transition: `transform 850ms ${EASE}, opacity 650ms ease`,
    pointerEvents: phase === 3 ? "auto" : "none",
  };

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

      <div ref={stageRef} className="relative" style={{ minHeight: 232 }}>
        {/* ── Beats 0–1: the sector grid. In flow, so it sets the card height. ── */}
        <div style={gridStyle}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full block" aria-hidden={phase > 1}>
            <text
              x={VB_W / 2} y="14" textAnchor="middle"
              fontSize="9" fontWeight="700" fill="#6c7793"
            >
              {showNumbers ? "15 SECTORS" : "223 COMPONENTS"}
            </text>

            {SECTORS.map((s, i) => {
              const { x, y } = cell(i);
              const lit = showNumbers && i === BATTERIES;
              return (
                <g key={s.name}>
                  <rect
                    ref={i === BATTERIES ? batteryRef : undefined}
                    x={x} y={y} width={CW - 8} height={CH - 10} rx="6"
                    fill={showNumbers ? (lit ? "#0d9488" : "#14b8a6") : "#f2f4f8"}
                    opacity={showNumbers && !lit ? 0.45 : 1}
                    style={{ transition: `fill 600ms ease, opacity 600ms ease` }}
                  />
                  {lit && (
                    <rect
                      x={x - 2.5} y={y - 2.5} width={CW - 3} height={CH - 5} rx="8"
                      fill="none" stroke="#0f766e" strokeWidth="1.6"
                    />
                  )}

                  {/* Two label nodes cross-faded rather than one with an
                      animated `y`: the SVG y attribute is not dependably
                      CSS-transitionable outside Chrome. */}
                  <text
                    x={x + (CW - 8) / 2} y={y + 12} textAnchor="middle"
                    fontSize={s.name.length > 14 ? 7 : 8.5} fontWeight="600" fill="#6c7793"
                    style={{ opacity: showNumbers ? 0 : 1, transition: "opacity 450ms ease" }}
                  >
                    {s.name}
                  </text>
                  <text
                    x={x + (CW - 8) / 2} y={y + 26} textAnchor="middle"
                    fontSize={s.name.length > 14 ? 7 : 8.5} fontWeight="600" fill="#ffffff"
                    style={{ opacity: showNumbers ? 1 : 0, transition: "opacity 450ms ease 120ms" }}
                  >
                    {s.name}
                  </text>

                  {/* one dot per component */}
                  <g
                    style={{
                      opacity: showNumbers ? 0 : 1,
                      transition: "opacity 500ms ease",
                    }}
                  >
                    {dots(i, s.n).map((d, k) => (
                      <circle
                        key={k} cx={d.cx} cy={d.cy} r="2.1"
                        fill={i === BATTERIES ? "#0d9488" : "#2dd4bf"}
                        opacity={i === BATTERIES ? 1 : 0.8}
                      />
                    ))}
                  </g>

                  {/* the same information as a count */}
                  <text
                    x={x + (CW - 8) / 2} y={y + 42} textAnchor="middle"
                    fontSize="11" fontWeight="700" fill="#ffffff"
                    style={{
                      opacity: showNumbers ? 0.95 : 0,
                      transition: "opacity 500ms ease 150ms",
                    }}
                  >
                    {s.n}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Beat 2: inside Batteries — the 26 chemistries (zooms in) ── */}
        <div className="absolute inset-0 flex flex-col justify-center" style={chemStyle} aria-hidden={phase !== 2}>
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
                      ref={c === "LFP" ? lfpRef : undefined}
                      className={
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded " +
                        (c === "LFP" ? "bg-flux-600 text-white" : "bg-ink-100 text-ink-600")
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

        {/* ── Beat 3: one chemistry's fidelity ladder (slides in sideways) ── */}
        <div className="absolute inset-0 flex flex-col justify-center" style={ladderStyle} aria-hidden={phase !== 3}>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-flux-600 text-white">
              LFP
            </span>
            <span className="text-xs uppercase tracking-widest text-ink-400 font-bold">
              EC018 · same cell, four models
            </span>
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

        {/* ── Demo cursor. Travels to the real target, then clicks it. ── */}
        <div
          data-demo-cursor
          className="absolute"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            transition: "transform 900ms cubic-bezier(.33,.72,.3,1), opacity 350ms ease",
            opacity: cursor.show ? 1 : 0,
            pointerEvents: "none",
            zIndex: 20,
          }}
          aria-hidden="true"
        >
          {/* click ripple, centred on the pointer tip */}
          <span
            className="block absolute rounded-full border-2 border-flux-500"
            style={{
              left: -13,
              top: -13,
              width: 26,
              height: 26,
              opacity: clicking ? 0 : 0,
              animation: clicking ? "nx-ping 480ms ease-out" : "none",
            }}
          />
          <svg
            viewBox="0 0 24 24"
            style={{
              width: 20,
              height: 20,
              display: "block",
              transform: clicking ? "scale(0.82)" : "scale(1)",
              transition: "transform 140ms ease",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,.35))",
            }}
          >
            <path
              d="M5 2.5 L5 18.2 L9.1 14.3 L11.7 20.6 L14.4 19.4 L11.8 13.2 L17.4 13.2 Z"
              fill="#111725"
              stroke="#ffffff"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
