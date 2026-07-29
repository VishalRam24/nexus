import React from "react";
import { AngledDivider, IconBadge, Icons } from "../components/ui.jsx";

const STAGES = [
  { n: 1, title: "Build the digital twin", sub: "model the energy system", today: true, nexus: true },
  { n: 2, title: "Control & optimise", sub: "plan & dispatch on the twin", today: true, nexus: true },
  { n: 3, title: "Deploy on the real system", sub: "controller runs the real plant", today: true, nexus: true },
  { n: 4, title: "Find where the twin deviates", sub: "which assumption is wrong?", today: "manual", nexus: "new" },
  { n: 5, title: "Keep it corrected", sub: "track reality over time", today: false, nexus: "new" },
];

function Mark({ state }) {
  if (state === true)
    return (
      <span className="inline-flex items-center gap-1 text-flux-600 font-semibold text-xs">
        {Icons.check} covered
      </span>
    );
  if (state === "manual")
    return (
      <span className="inline-flex items-center gap-1 text-ember-600 font-semibold text-xs">
        {Icons.warn} manual · slow
      </span>
    );
  if (state === "new")
    return (
      <span className="inline-flex items-center gap-1 text-flux-600 font-semibold text-xs">
        {Icons.check} new
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-ink-400 font-semibold text-xs">
      {Icons.cross} not available
    </span>
  );
}

export default function Problem() {
  return (
    <section id="problem" className="mt-48 md:mt-40 pb-40 relative bg-ink-100">
      <AngledDivider colorClass="text-ink-100" flip />

      <div className="container mx-auto">
        <div className="flex flex-wrap items-center">
          {/* Notus's card-with-polygon-overlay, recoloured. */}
          <div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-32">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-flux-600">
              <div className="h-48 rounded-t-lg bg-ink-800 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="text-ink-400 text-xs uppercase tracking-widest font-bold">
                    the reverse question
                  </div>
                  <div className="text-white font-mono text-lg mt-3 leading-relaxed">
                    observed dispatch
                    <div className="text-flux-400 my-1">↓</div>
                    which input is wrong?
                  </div>
                </div>
              </div>
              <blockquote className="relative p-8 mb-4">
                <svg
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 583 95"
                  className="absolute left-0 w-full block h-95-px -top-94-px"
                >
                  <polygon points="-30,95 583,95 583,65" className="text-flux-600 fill-current" />
                </svg>
                <h4 className="text-xl font-bold text-white">
                  A twin nobody reconciled is an assumption
                </h4>
                <p className="text-md font-light mt-2 text-white">
                  A digital twin that has never been checked against observed
                  behaviour is a sophisticated assumption, not a measurement.
                  Reconciling it is the slowest, most manual, least rigorous step
                  in the whole workflow.
                </p>
              </blockquote>
            </div>
          </div>

          <div className="w-full md:w-6/12 px-4">
            <div className="flex flex-wrap">
              <div className="w-full px-4">
                <IconBadge tone="light">{Icons.check}</IconBadge>
                <h6 className="text-xl mb-1 font-semibold text-ink-800">
                  What every tool does
                </h6>
                <p className="mb-6 text-ink-500 leading-relaxed">
                  <span className="italic">
                    “Given these costs and efficiencies, what is the optimal
                    plan?”
                  </span>{" "}
                  Answered in one forward solve. Trusted, exact, already in
                  production — but it cannot tell you whether its own inputs
                  describe reality.
                </p>
              </div>
              <div className="w-full px-4">
                <IconBadge tone="ember">{Icons.warn}</IconBadge>
                <h6 className="text-xl mb-1 font-semibold text-ink-800">
                  What you actually need
                </h6>
                <p className="mb-4 text-ink-500 leading-relaxed">
                  <span className="italic">
                    “My output does not match the real system. Which input is
                    wrong, and by how much?”
                  </span>{" "}
                  Answered today by brute force: perturb an input, re-solve,
                  repeat hundreds of times.
                </p>
                <p className="text-ink-500 leading-relaxed">
                  Morris, Sobol and MGA sweeps cost hours to days and scale with
                  every parameter. Worse, they return a confident number even
                  when the data cannot identify it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lifecycle coverage */}
        <div className="mt-24 px-4">
          <h3 className="text-3xl font-semibold text-ink-800 mb-2">
            Where the coverage stops
          </h3>
          <p className="text-ink-500 mb-8 lg:w-8/12">
            Today&apos;s libraries help you build and plan. Nexus does that too,
            then adds the two stages that come after the model meets the real
            world.
          </p>

          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="items-center w-full border-collapse min-w-[42rem]">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs uppercase font-bold text-left text-ink-500 bg-ink-100 border-b border-ink-200">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-xs uppercase font-bold text-left text-ink-500 bg-ink-100 border-b border-ink-200">
                    Today&apos;s libraries
                  </th>
                  <th className="px-6 py-3 text-xs uppercase font-bold text-left text-ink-500 bg-ink-100 border-b border-ink-200">
                    Nexus
                  </th>
                </tr>
              </thead>
              <tbody>
                {STAGES.map((s) => (
                  <tr key={s.n} className="border-b border-ink-200 last:border-0">
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-ink-800 text-sm">
                        <span className="text-ink-300 mr-2">{s.n}</span>
                        {s.title}
                      </div>
                      <div className="text-xs text-ink-400 mt-1 ml-5">{s.sub}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <Mark state={s.today} />
                    </td>
                    <td className="px-6 py-4 align-top">
                      <Mark state={s.nexus} />
                    </td>
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
