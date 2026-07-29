import React from "react";
import { SectionHeading, Pill } from "../components/ui.jsx";

const TOOLS = [
  { tool: "PyPSA", cat: "Capacity expansion (Python)", back: "forward only", vs: "−0.000 % objective gap", tone: "win" },
  { tool: "PyPSA-Eur", cat: "Continental EU dataset", back: "forward only", vs: "the calibration testbed", tone: "neutral" },
  { tool: "GenX", cat: "Expansion + UC (Julia)", back: "forward only", vs: "−0.02 % objective gap", tone: "win" },
  { tool: "Tulipa", cat: "Representative-period model (Julia)", back: "forward only", vs: "≈ parity", tone: "neutral" },
  { tool: "PowerModels.jl", cat: "AC-OPF relaxations (Julia)", back: "forward only", vs: "SOCP parity, 7.6× faster", tone: "win" },
  { tool: "pandapower", cat: "AC-OPF (Python)", back: "forward only", vs: "parity, 42–60× faster", tone: "win" },
  { tool: "oemof · Calliope · Sienna", cat: "Energy system frameworks", back: "forward only", vs: "feature-matrix peers", tone: "neutral" },
  { tool: "Pyomo · Linopy · CVXPY", cat: "Modelling layers", back: "cvxpylayers gives grads", vs: "differentiation is native", tone: "neutral" },
  { tool: "DiffOpt.jl", cat: "Differentiable optimisation (Julia)", back: "grads, no integer support", vs: "+ calibration, + scale, + PyPSA import", tone: "neutral" },
  { tool: "Simulink · Modelica", cat: "Dynamic / EMT simulation", back: "different category", vs: "not benchmarked — out of scope", tone: "muted" },
];

const NOVELTY = [
  { cap: "Differentiable optimisation, in general", status: "prior art", who: "OptNet · cvxpylayers · DiffOpt.jl" },
  { cap: "Implicit gradients through an energy expansion LP", status: "taken", who: "Degleris 2024 · Mieth 2026" },
  { cap: "Forward design-gradient planning", status: "taken", who: "Degleris 2024" },
  { cap: "Inverse calibration of techno-economic parameters to observed data", status: "open", who: "no prior art found" },
  { cap: "Continental / PyPSA-Eur scale on a native fast differentiable solver", status: "open", who: "prior art is ≤100-node / 5-bus" },
  { cap: "UC-MILP differentiability in energy", status: "not claimed", who: "open & hard — future work" },
];

function StatusPill({ status }) {
  if (status === "open")
    return <Pill tone="flux">open — this work</Pill>;
  if (status === "not claimed")
    return <Pill tone="ember">not claimed</Pill>;
  return <Pill tone="neutral">{status}</Pill>;
}

export default function Comparison() {
  return (
    <section id="compare" className="relative py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="The existing-tools landscape"
          title="How Nexus compares to the libraries you already use."
          lede="Every production energy tool solves the problem forward only. The one differentiable peer has no integer support and no calibration workflow. Only Nexus adds the reverse step."
        />

        <div className="overflow-x-auto rounded-lg shadow-lg border border-ink-200">
          <table className="items-center w-full border-collapse min-w-[48rem]">
            <thead>
              <tr>
                {["Tool", "Category", "Backward?", "Nexus vs it"].map((h) => (
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
              {TOOLS.map((r) => (
                <tr key={r.tool} className="border-b border-ink-200 hover:bg-ink-100/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-ink-800 text-sm whitespace-nowrap">
                    {r.tool}
                  </td>
                  <td className="px-6 py-4 text-ink-500 text-sm">{r.cat}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={r.back === "forward only" ? "text-ink-400" : "text-ink-600"}>
                      {r.back}
                    </span>
                  </td>
                  <td
                    className={
                      "px-6 py-4 text-sm font-medium " +
                      (r.tone === "win"
                        ? "text-flux-700"
                        : r.tone === "muted"
                        ? "text-ink-400"
                        : "text-ink-600")
                    }
                  >
                    {r.vs}
                  </td>
                </tr>
              ))}
              <tr className="bg-ink-800">
                <td className="px-6 py-4 font-bold text-white text-sm">Nexus</td>
                <td className="px-6 py-4 text-ink-300 text-sm">
                  Expansion + UC + OPF
                </td>
                <td className="px-6 py-4 text-flux-400 text-sm font-semibold">
                  inverse calibration
                </td>
                <td className="px-6 py-4 text-ink-400 text-sm">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Novelty ledger */}
        <div className="mt-20">
          <h3 className="text-3xl font-semibold text-ink-800 mb-2">
            What is borrowed, and what is not
          </h3>
          <p className="text-ink-500 mb-8 lg:w-8/12">
            Separating prior art from the new contribution, line by line, so the
            claim survives scrutiny.
          </p>

          <div className="overflow-x-auto rounded-lg shadow-lg border border-ink-200">
            <table className="items-center w-full border-collapse min-w-[42rem]">
              <thead>
                <tr>
                  {["Capability", "Status", "Held by"].map((h) => (
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
                {NOVELTY.map((r) => (
                  <tr key={r.cap} className="border-b border-ink-200 last:border-0">
                    <td className="px-6 py-4 text-ink-700 text-sm">{r.cap}</td>
                    <td className="px-6 py-4"><StatusPill status={r.status} /></td>
                    <td className="px-6 py-4 text-ink-500 text-sm">{r.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
