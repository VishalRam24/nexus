import React from "react";
import { IconBadge, SectionHeading, Icons } from "../components/ui.jsx";

const DESKS = [
  {
    icon: Icons.grid,
    role: "Transmission system operator",
    title: "Calibrate a continental expansion model without a sampling campaign.",
    body: "Billion-euro build-out decisions are tuned today by hand and by MGA re-runs. Nexus replaces the sweep with a backward pass — and tells you which extra data would shrink an identified set before you commission it.",
    kicker: "From days of re-solves per study to a handful.",
  },
  {
    icon: Icons.scale,
    role: "Energy regulator",
    title: "What price reproduces the observed build-out?",
    body: "Ask the policy question backwards and get an interval with a correctness guarantee from plant-and-recover, rather than a single contestable number.",
    kicker: "A defensible range, not a guess.",
  },
  {
    icon: Icons.factory,
    role: "Plant and storage operator",
    title: "Kill the model mismatch that breaks MPC deployments.",
    body: "Datasheet efficiencies drift from reality. The auto-calibrator keeps the control model matched to telemetry continuously, identifiability-gated so noise never moves a parameter.",
    kicker: "Recovers nearly all of the cost a wrong model bleeds.",
  },
  {
    icon: Icons.briefcase,
    role: "Consultancy and due diligence",
    title: "Separate a wrong model from genuinely bad operation.",
    body: "Naively comparing a history to a re-optimised plan conflates two causes. Calibrate first to absorb everything explainable by corrected parameters, then read the residual gap as a euro-ranked list of candidate operational mistakes.",
    kicker: "Attribution you can put in front of a client.",
  },
];

export default function WherePays() {
  return (
    <section id="where" className="relative py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Where it pays"
          title="The slow, manual step removed, four ways."
          lede="Wherever a digital twin has to meet the real world, calibration is the tax. These are the desks where an analytic inverse turns an overnight study into an interactive one."
        />

        <div className="flex flex-wrap">
          {DESKS.map((d) => (
            <div key={d.role} className="w-full md:w-6/12 px-4 mb-10">
              <div className="h-full bg-ink-100 rounded-lg p-8 shadow-lg">
                <IconBadge tone="ink" size="lg">
                  {d.icon}
                </IconBadge>
                <span className="block text-xs font-bold uppercase tracking-widest text-flux-600 mb-2">
                  {d.role}
                </span>
                <h4 className="text-xl font-semibold text-ink-800 leading-snug">
                  {d.title}
                </h4>
                <p className="text-ink-500 mt-4 leading-relaxed">{d.body}</p>
                <p className="text-ink-700 font-semibold mt-4 text-sm">
                  {d.kicker}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
