import React from "react";
import { SectionHeading, Pill } from "../components/ui.jsx";

const TODAY = [
  {
    tag: "How it's done today · A",
    title: "A trained black box",
    body: "Train a neural network to imitate one system and read the inputs back from it. It only works for the exact system it was trained on; a new network means starting over, and it never uses the model's real equations.",
    verdict: "Locked to one trained system",
  },
  {
    tag: "How it's done today · B",
    title: "Sobol guessing",
    body: "Sprinkle hundreds of guesses across the range and keep the closest. Mathematically sound, but it is still guessing: heavy to compute, and it never lands exactly on the answer.",
    verdict: "Hundreds of solves, still approximate",
  },
];

export default function Approach() {
  return (
    <section id="approach" className="relative py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Prior work & the gap"
          title="The trick is borrowed. Recovering your inputs honestly is not."
          lede="Differentiating an optimisation is a known idea. The few ways people recover hidden inputs today all share one blind spot: they never look inside the optimisation that produced the data."
        />

        <div className="flex flex-wrap items-stretch">
          <div className="w-full lg:w-4/12 px-4 mb-8">
            <div className="h-full bg-ink-800 rounded-lg shadow-lg p-8">
              <span className="text-xs font-bold uppercase tracking-widest text-flux-400">
                Is the idea new?
              </span>
              <h4 className="text-2xl font-semibold text-white mt-3">
                No — and we borrow it openly.
              </h4>
              <p className="text-ink-300 mt-4 leading-relaxed">
                Differentiating through an optimisation to get the slope of its
                answer is an established technique — OptNet, cvxpylayers,
                DiffOpt.jl. We take it as-is.
              </p>
              <p className="text-white mt-4 leading-relaxed">
                What is new is the <span className="font-semibold">use</span>:
                recovering the techno-economic inputs of a real planning model
                from what it actually did.
              </p>
              <div className="mt-6">
                <Pill tone="flux">Mechanism cited</Pill>
                <Pill tone="flux">Application new</Pill>
              </div>
            </div>
          </div>

          {TODAY.map((t) => (
            <div key={t.title} className="w-full md:w-6/12 lg:w-4/12 px-4 mb-8">
              <div className="h-full bg-ink-100 rounded-lg shadow-lg p-8">
                <span className="text-xs font-bold uppercase tracking-widest text-ink-400">
                  {t.tag}
                </span>
                <h4 className="text-2xl font-semibold text-ink-800 mt-3">
                  {t.title}
                </h4>
                <p className="text-ink-500 mt-4 leading-relaxed">{t.body}</p>
                <div className="mt-6">
                  <Pill tone="ember">{t.verdict}</Pill>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center mt-8">
          <div className="w-full lg:w-10/12 px-4">
            <div className="border-l-4 border-flux-500 bg-flux-300/10 rounded-r-lg p-8">
              <h4 className="text-xl font-semibold text-ink-800">
                Both work from the numbers alone — blind to the logic.
              </h4>
              <p className="text-ink-600 mt-3 leading-relaxed">
                The black box and the sampler treat the model as a sealed box and
                fit to its outputs. Nexus differentiates through the optimisation
                itself, using the model&apos;s own structure to pinpoint which
                input is wrong — directly, exactly, and in a handful of solves.
              </p>
              <p className="text-sm text-ink-500 mt-4 leading-relaxed">
                Mechanically: the forward model is built as an LP/MILP/QP/SOCP by
                a Rust constraint assembler and solved as usual. The backward
                pass differentiates the optimum via the implicit function theorem
                on the KKT system, with a small ridge term so the LP gradient is
                well defined. Calibration is safeguarded Gauss-Newton on that
                analytic Jacobian — and identifiability is read directly off
                where the Jacobian goes to zero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
