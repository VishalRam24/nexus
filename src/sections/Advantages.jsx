import React from "react";
import { AngledDivider, IconBadge, SectionHeading, Icons } from "../components/ui.jsx";

const ITEMS = [
  {
    icon: Icons.bug,
    tag: "Debugging the twin",
    title: "Find the mismatch in minutes, not weeks.",
    body: "When the real system and its digital twin disagree, the slow part is working out which input is to blame. Nexus answers that directly, turning the least rigorous, most manual step in the workflow into a single backward pass.",
    kicker: "The hardest debugging step, automated.",
  },
  {
    icon: Icons.loop,
    tag: "Auto-calibration",
    title: "The model fixes itself, while it keeps running.",
    body: "Embedded in a control loop, the model self-corrects from live telemetry between horizons — continuously shrinking the gap between datasheet and reality, with no engineer in the loop.",
    kicker: "Recovers nearly all of the cost a wrong model bleeds.",
  },
  {
    icon: Icons.target,
    tag: "vs black box & Sobol",
    title: "Quick and machine-precise, not heavy and approximate.",
    body: "A trained black box is locked to the one system it learned; Sobol sampling burns hundreds of solves only to get close. Reading the slope of the optimisation directly, Nexus lands on the answer exactly.",
    kicker: "12 solves, exact — vs 426, approximate.",
  },
  {
    icon: Icons.bolt,
    tag: "Under the hood · bonus",
    title: "Rust-native, so the speed is built in.",
    body: "Not the goal, but a real win: the constraint assembly is Rust end to end, Python is a thin wrapper before a fast solver runs. The LP formulation is tighter, and a warm restart reuses it instead of rebuilding every step.",
    kicker: "3.5–6× faster forward solves than PyPSA.",
  },
];

const STATS = [
  { v: "0.000%", l: "objective gap vs PyPSA on production Eur runs" },
  { v: "3.5–6×", l: "faster forward solves than PyPSA" },
  { v: "4.7×", l: "faster than GenX on committed unit commitment" },
  { v: "6.3e-10", l: "gradient error vs finite differences through the bridge" },
];

export default function Advantages() {
  return (
    <section id="advantages" className="relative py-24 bg-ink-800">
      <AngledDivider colorClass="text-ink-800" flip />

      <div className="container mx-auto px-4 pt-8">
        <SectionHeading
          dark
          eyebrow="Why it wins"
          title="What you actually get for it."
          lede="Four advantages — from the daily time it saves, to the engine underneath that makes the speed structural rather than incidental."
        />

        <div className="flex flex-wrap">
          {ITEMS.map((it) => (
            <div key={it.tag} className="w-full md:w-6/12 px-4 mb-10">
              <div className="h-full bg-ink-900/60 rounded-lg p-8 border border-ink-700">
                <IconBadge tone="flux">{it.icon}</IconBadge>
                <span className="block text-xs font-bold uppercase tracking-widest text-flux-400 mb-2">
                  {it.tag}
                </span>
                <h4 className="text-2xl font-semibold text-white leading-snug">
                  {it.title}
                </h4>
                <p className="text-ink-300 mt-4 leading-relaxed">{it.body}</p>
                <p className="text-flux-300 font-semibold mt-4 text-sm">
                  {it.kicker}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-10 border-t border-ink-700">
          <p className="text-center text-ink-300 text-lg mb-10 lg:w-8/12 mx-auto">
            Exact parity first. The inverse only matters if the forward model is
            the one you trust.
          </p>
          <div className="flex flex-wrap text-center">
            {STATS.map((s) => (
              <div key={s.v} className="w-full sm:w-6/12 lg:w-3/12 px-4 mb-8">
                <div className="text-4xl font-bold text-flux-400">{s.v}</div>
                <div className="text-sm text-ink-400 mt-2 leading-relaxed">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
