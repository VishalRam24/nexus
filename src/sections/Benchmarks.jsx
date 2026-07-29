import React from "react";
import { AngledDivider, SectionHeading, Icons } from "../components/ui.jsx";

const ROWS = [
  {
    case: "PyPSA-Eur capacity expansion",
    detail: "10 bus · 33 gen (25 extendable) · 6 AC lines · 10 DC links · 5 batteries + 5 H₂ stores · 2190 h, full realistic profiles",
    gap: "−0.000 %",
    gapNote: "exact parity",
    speed: "233 s vs 810 s",
    speedNote: "3.47× faster",
    status: "green",
  },
  {
    case: "GenX 1_three_zones_ucommit2",
    detail: "Committed unit commitment, gas-only build",
    gap: "−0.02 %",
    gapNote: "exact",
    speed: "7.7 s vs 36.1 s",
    speedNote: "4.7× faster",
    status: "green",
  },
  {
    case: "pandapower AC-OPF case9 / case14",
    detail: "Jabr SOCP vs runopp, isolated venv subprocess",
    gap: "+0.0007 % / +0.0792 %",
    gapNote: "",
    speed: "60.5× / 42.2×",
    speedNote: "",
    status: "green",
  },
  {
    case: "PowerModels.jl SOCWR",
    detail: "3-bus radial parity",
    gap: "3.67e-5",
    gapNote: "",
    speed: "7.57×",
    speedNote: "",
    status: "green",
  },
  {
    case: "CINDER LP",
    detail: "Multi-carrier dispatch",
    gap: "parity",
    gapNote: "",
    speed: "147 s vs 190 s",
    speedNote: "1.3× faster",
    status: "green",
  },
  {
    case: "CINDER MILP",
    detail: "Same instance with integer unit commitment · MIP gap 0.82 %",
    gap: "—",
    gapNote: "",
    speed: "330 s vs 190 s",
    speedNote: "1.7× SLOWER",
    status: "amber",
  },
];

export default function Benchmarks() {
  return (
    <section id="benchmarks" className="relative py-24 bg-ink-100">
      <AngledDivider colorClass="text-ink-100" flip />

      <div className="container mx-auto px-4 pt-8">
        <SectionHeading
          eyebrow="Measured, not asserted"
          title="Benchmarks — and their honest state."
          lede="Every row below comes from a reproducible script where both solvers see the identical network. The results that are not wins are on this page too."
        />

        <div className="overflow-x-auto rounded-lg shadow-lg bg-white border border-ink-200">
          <table className="items-center w-full border-collapse min-w-[52rem]">
            <thead>
              <tr>
                {["Case", "Objective vs reference", "Wall clock"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-xs uppercase font-bold text-left text-ink-500 bg-ink-100 border-b border-ink-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.case} className="border-b border-ink-200 last:border-0">
                  <td className="px-6 py-5 align-top">
                    <div className="flex items-start gap-2">
                      <span
                        className={
                          "mt-1 w-2 h-2 rounded-full flex-shrink-0 " +
                          (r.status === "green" ? "bg-flux-500" : "bg-ember-500")
                        }
                      />
                      <div>
                        <div className="font-semibold text-ink-800 text-sm">
                          {r.case}
                        </div>
                        <div className="text-xs text-ink-400 mt-1 leading-relaxed max-w-md">
                          {r.detail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="font-mono text-sm text-ink-800">{r.gap}</div>
                    {r.gapNote && (
                      <div className="text-xs text-flux-600 font-semibold mt-1">
                        {r.gapNote}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="font-mono text-sm text-ink-800">{r.speed}</div>
                    {r.speedNote && (
                      <div
                        className={
                          "text-xs font-semibold mt-1 " +
                          (r.status === "green" ? "text-flux-600" : "text-ember-600")
                        }
                      >
                        {r.speedNote}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* The open bug — stated plainly. */}
        <div className="mt-10 rounded-lg border-l-4 border-ember-500 bg-ember-300/15 p-8">
          <div className="flex items-start gap-3">
            <span className="text-ember-600 mt-1 flex-shrink-0">{Icons.warn}</span>
            <div>
              <h4 className="text-xl font-semibold text-ink-800">
                Two GenX cases look like big wins. They are a bug in Nexus.
              </h4>
              <p className="text-ink-600 mt-3 leading-relaxed">
                GenX <span className="font-mono text-sm">rate_co2</span> reports
                −42.7 % and <span className="font-mono text-sm">mincapreq</span>{" "}
                −3.90 % against the reference. Those are{" "}
                <span className="font-semibold">not</span> a cheaper optimum. A
                gold-standard check — feeding the capacity Nexus chose back into a
                real GenX solve — found GenX&apos;s own cost for the Nexus
                solution (5.823e9) essentially matches GenX&apos;s optimum
                (5.808e9), while Nexus <em>reports</em> 5.582e9.
              </p>
              <p className="text-ink-600 mt-3 leading-relaxed">
                That is a{" "}
                <span className="font-semibold">
                  ~4.3 % OPEX under-count in Nexus
                </span>
                . The lead suspect is transmission-loss modelling — GenX uses
                piecewise-linear, Nexus a linear percentage loss. The pattern:
                Nexus matches exactly when the build is determined, and
                under-counts opex when multi-zone renewables are dispatched over
                transmission.
              </p>
              <p className="text-ink-600 mt-3 leading-relaxed text-sm">
                The exact-parity rows in the table are unaffected — none of them
                involve renewables over transmission. This is listed here rather
                than buried because a benchmark page that only shows wins is not
                worth reading.
              </p>
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="mt-16 flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4 mb-8">
            <h4 className="text-2xl font-semibold text-ink-800 mb-4">Does</h4>
            <ul className="space-y-3">
              {[
                "Exact-parity forward solve vs PyPSA and GenX, with a faster build.",
                "Inverse calibration — recovers hidden techno-economic inputs from observed dispatch, analytically.",
                "Identifiability honesty — when the data cannot pin a parameter, it says so.",
                "Self-calibrating control — an MPC that fixes its own model from telemetry between horizons.",
                "Design gradients — ∂cost/∂capacity for every technology from a single solve.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-ink-600 leading-relaxed">
                  <span className="text-flux-600 mt-1 flex-shrink-0">{Icons.check}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-6/12 px-4 mb-8">
            <h4 className="text-2xl font-semibold text-ink-800 mb-4">
              Doesn&apos;t — yet, or by design
            </h4>
            <ul className="space-y-3">
              {[
                "Not dynamic or EMT simulation — no transients, no swing equation. A different category from Simulink and Modelica.",
                "No integer (UC-MILP) differentiability. Stated as future work, not claimed.",
                "Calibration is LP/QP class; a small ridge term distorts economics by roughly 1–7 percentage points, disclosed per result.",
                "The speed headline is forward-only — the calibration solve uses a denser path.",
                "The Belgian case is a methodology demonstration on an islanded system, not a policy-grade number.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-ink-600 leading-relaxed">
                  <span className="text-ember-600 mt-1 flex-shrink-0">{Icons.cross}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
