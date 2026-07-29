import React from "react";
import { Icons, GITHUB_PATH } from "./components/ui.jsx";
import FidelityExplainer from "./components/FidelityExplainer.jsx";
import CodeBlock from "./components/CodeBlock.jsx";
import pattern from "./assets/pattern_nexus.png";

/**
 * Mirrors the section structure of Notus React's Index.js (Creative Tim, MIT)
 * block for block — hero, the big tinted section with four blocks, the dark
 * card grid, the Open Source panel and the closing CTA card — with the Nexus
 * palette and Nexus content. The only section that is not in Notus is
 * "Where the coverage stops".
 */

const FEATURES = [
  {
    icon: Icons.bug,
    title: "Debugging the twin",
    body: "Find which input is to blame in a single backward pass, instead of weeks of manual bisection.",
  },
  {
    icon: Icons.loop,
    title: "Auto-calibration",
    body: "In a control loop the model self-corrects from live telemetry between horizons, with no engineer involved.",
  },
  {
    icon: Icons.target,
    title: "Exact, not approximate",
    body: "Reading the slope of the optimisation directly lands on the answer — 12 solves, not 426.",
  },
  {
    icon: Icons.bolt,
    title: "Rust-native core",
    body: "Constraint assembly is Rust end to end, so the speed is structural rather than incidental.",
  },
];

const TAGS = [
  "Capacity expansion", "Economic dispatch", "Unit commitment", "DC-OPF",
  "Polar AC-OPF", "SOCP relaxations", "Storage", "Sector coupling",
  "CO₂ caps", "RPS / CES", "Reserves", "Rolling horizon",
];

const UNDER_HOOD = [
  {
    n: "01",
    t: "Solve forward, as usual",
    d: "A Rust assembler builds the LP/MILP/QP/SOCP and any solver you like runs it.",
  },
  {
    n: "02",
    t: "Differentiate the optimum",
    d: "The implicit function theorem on the KKT system, with a small ridge so the LP gradient is well defined.",
  },
  {
    n: "03",
    t: "Recover, then admit the limits",
    d: "Safeguarded Gauss–Newton on that Jacobian — and where the Jacobian vanishes, the data cannot identify the parameter, so it says so.",
  },
];

const DESKS = [
  {
    icon: Icons.grid,
    role: "Transmission system operator",
    body: "Calibrate a continental expansion model without a sampling campaign — and learn which extra data would shrink an identified set before commissioning it.",
    kicker: "Days of re-solves → a handful.",
  },
  {
    icon: Icons.scale,
    role: "Energy regulator",
    body: "Ask the policy question backwards: what price reproduces the observed build-out? Get an interval with a correctness guarantee, not a single contestable number.",
    kicker: "A defensible range, not a guess.",
  },
  {
    icon: Icons.factory,
    role: "Plant and storage operator",
    body: "Datasheet efficiencies drift. The auto-calibrator keeps the control model matched to telemetry continuously, gated so noise never moves a parameter.",
    kicker: "Kills the mismatch that breaks MPC.",
  },
];

const STAGES = [
  { n: 1, title: "Build the digital twin", sub: "model the energy system", today: "yes", nexus: "yes" },
  { n: 2, title: "Control & optimise", sub: "plan & dispatch on the twin", today: "yes", nexus: "yes" },
  { n: 3, title: "Deploy on the real system", sub: "controller runs the real plant", today: "yes", nexus: "yes" },
  { n: 4, title: "Find where the twin deviates", sub: "which assumption is wrong?", today: "manual", nexus: "new" },
  { n: 5, title: "Keep it corrected", sub: "track reality over time", today: "no", nexus: "new" },
];

function Mark({ state }) {
  const map = {
    yes: ["text-flux-600", Icons.check, "covered"],
    new: ["text-flux-600", Icons.check, "new"],
    manual: ["text-ember-600", Icons.warn, "manual · slow"],
    no: ["text-ink-400", Icons.cross, "not available"],
  };
  const [cls, icon, label] = map[state];
  return (
    <span className={"inline-flex items-center gap-1 font-semibold text-xs " + cls}>
      {icon} {label}
    </span>
  );
}

const badge =
  "text-flux-600 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white";
const badgeLg =
  "text-flux-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white";
const tag =
  "text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-ink-500 bg-white last:mr-0 mr-2 mt-2";

export default function Index() {
  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <span className="text-xs font-bold uppercase tracking-widest text-flux-600">
                A Python library for energy-system engineers
              </span>
              <h2 className="font-semibold text-4xl text-ink-700 mt-3">
                Energy models that answer backwards.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-500">
                If you build energy-system digital twins in Python and optimise
                them, Nexus does the whole forward job you do today —{" "}
                <span className="text-ink-700 font-semibold">
                  at exact parity with PyPSA and GenX, several times faster
                </span>
                .
              </p>
              <p className="mt-3 text-lg leading-relaxed text-ink-500">
                Then it does the part nothing else does: when the twin disagrees
                with the real system, it tells you{" "}
                <span className="text-ink-700 font-semibold">
                  which of your inputs is wrong
                </span>{" "}
                — analytically, in a handful of solves instead of a
                days-long sampling sweep.
              </p>

              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
                {[
                  ["0.000%", "objective gap vs PyPSA"],
                  ["3.5–6×", "faster forward solves"],
                  ["12 vs 426", "solves to recover an input"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-xl font-bold text-flux-600 font-mono">{v}</div>
                    <div className="text-xs text-ink-400 uppercase tracking-wide mt-0.5">
                      {l}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <a
                  href="#install"
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-flux-500 active:bg-flux-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Get started
                </a>
                <a
                  href="https://github.com/VishalRam24/nexus-energy"
                  target="_blank"
                  rel="noreferrer"
                  className="github-star ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-ink-700 active:bg-ink-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
        <img
          className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860-px"
          src={pattern}
          alt=""
        />
      </section>

      {/* ── 2. The big tinted section ───────────────────────────── */}
      <section id="what" className="mt-48 md:mt-40 pb-40 relative bg-ink-100">
        <div
          className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon className="text-ink-100 fill-current" points="2560 0 2560 100 0 100" />
          </svg>
        </div>

        {/* 2a — quote card + four features */}
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-32">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-flux-600">
                <div className="h-56 rounded-t-lg bg-ink-800 flex items-center justify-center px-6">
                  <div className="text-center">
                    <div className="text-ink-400 text-xs uppercase tracking-widest font-bold">
                      the reverse question
                    </div>
                    <div className="text-white font-mono text-lg mt-4 leading-relaxed">
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
                    Reconciling it is the slowest, most manual, least rigorous
                    step in the whole workflow.
                  </p>
                </blockquote>
              </div>
            </div>

            <div className="w-full md:w-6/12 px-4">
              <div className="flex flex-wrap">
                {FEATURES.map((f) => (
                  <div key={f.title} className="w-full md:w-6/12 px-4">
                    <div className="relative flex flex-col mt-4">
                      <div className="px-4 py-5 flex-auto">
                        <div className={badge}>{f.icon}</div>
                        <h6 className="text-xl mb-1 font-semibold text-ink-800">
                          {f.title}
                        </h6>
                        <p className="mb-4 text-ink-500">{f.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2b — capability block with tag pills */}
        <div className="container mx-auto overflow-hidden pb-20">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-48">
              <div className={badgeLg}>{Icons.grid}</div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal text-ink-800">
                A full forward model first
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-ink-600">
                The inverse only matters if the forward model is the one you
                trust. Nexus is a complete techno-economic energy model in its own
                right — the same family PyPSA and GenX belong to.
              </p>
              <div className="block pb-6">
                {TAGS.map((t) => (
                  <span key={t} className={tag}>
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="https://github.com/VishalRam24/nexus-energy/blob/main/WIKI.md"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-ink-700 hover:text-flux-600 ease-linear transition-all duration-150"
              >
                Read the user guide →
              </a>
            </div>

            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto mt-32">
              <div className="relative flex flex-col min-w-0 w-full mb-6 mt-48 md:mt-0">
                <div
                  className="rounded-lg absolute shadow-2xl bg-ink-900 p-5 font-mono text-xs text-ink-200 leading-relaxed"
                  style={{ maxWidth: "22rem", left: "-2rem", top: "-11rem", zIndex: 2 }}
                >
                  <div className="text-flux-400">import nexus_energy as ne</div>
                  <div className="mt-2">sys = ne.EnergySystem(&quot;plant&quot;)</div>
                  <div>elec = sys.add_bus(&quot;elec&quot;)</div>
                  <div>sys.add_generator(&quot;pv&quot;, ...)</div>
                  <div>r = sys.optimise()</div>
                </div>
                <div
                  className="rounded-lg absolute shadow-lg bg-white p-5"
                  style={{ maxWidth: "13rem", left: "15rem", top: "-4.5rem", zIndex: 3 }}
                >
                  <div className="text-xs uppercase tracking-widest text-ink-400 font-bold">
                    objective gap
                  </div>
                  <div className="text-3xl font-bold text-flux-600 mt-1">0.000%</div>
                  <div className="text-xs text-ink-500 mt-1">vs PyPSA, Eur runs</div>
                </div>
                <div
                  className="rounded-lg absolute shadow-xl bg-flux-500 p-5 text-white"
                  style={{ maxWidth: "12rem", left: "1rem", top: "2rem" }}
                >
                  <div className="text-xs uppercase tracking-widest opacity-80 font-bold">
                    forward solve
                  </div>
                  <div className="text-3xl font-bold mt-1">3.5–6×</div>
                  <div className="text-xs opacity-90 mt-1">faster than PyPSA</div>
                </div>
                <div
                  className="rounded-lg absolute shadow-lg bg-ink-800 p-4 text-white"
                  style={{ maxWidth: "17rem", left: "12rem", top: "9rem" }}
                >
                  <div className="text-xs uppercase tracking-widest text-ink-400 font-bold">
                    gradient error vs finite differences
                  </div>
                  <div className="text-2xl font-bold text-flux-400 mt-1 font-mono">
                    6.3e-10
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2c — the component library, explained by animation */}
          <div className="flex flex-wrap items-center pt-32">
            <div className="w-full md:w-6/12 px-4 mr-auto ml-auto mt-32">
              <FidelityExplainer />
            </div>

            <div className="w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-48">
              <div className={badgeLg}>{Icons.factory}</div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal text-ink-800">
                223 components, 15 sectors, many fidelities
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-ink-600">
                Fidelity is how much physics a component carries. The same LFP
                battery can be a single efficiency curve, a state-of-charge model,
                the same plus temperature, or a full equivalent-circuit network.
              </p>
              <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-ink-600">
                You choose the cheapest level that still answers the question —
                <span className="text-ink-800 font-normal">
                  {" "}
                  per component, not per study
                </span>
                . A capacity screen can run every component at F0 while the one
                asset under investigation runs at F2.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6">
                <div>
                  <div className="text-2xl font-bold text-flux-600">223</div>
                  <div className="text-xs text-ink-500 uppercase tracking-wide">components</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-flux-600">15</div>
                  <div className="text-xs text-ink-500 uppercase tracking-wide">sectors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-flux-600">F0–F2</div>
                  <div className="text-xs text-ink-500 uppercase tracking-wide">built for all</div>
                </div>
              </div>
              <p className="text-sm text-ink-400 mt-4 leading-relaxed">
                F3–F6 — distributed physics, AI surrogates and PINNs — are scaffolded
                but not yet built.
              </p>
            </div>
          </div>
        </div>

        {/* 2d — under the hood */}
        <div className="container mx-auto px-4 pb-32 pt-16">
          <div className="items-center flex flex-wrap">
            <div className="w-full md:w-5/12 ml-auto px-12 md:px-4">
              <div className="md:pr-12">
                <div className={badgeLg}>{Icons.target}</div>
                <h3 className="text-3xl font-semibold text-ink-800">
                  How the backward pass works
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-ink-500">
                  Three steps, and the third one is the part that keeps it
                  honest.
                </p>
                <ul className="list-none mt-6">
                  {UNDER_HOOD.map((u) => (
                    <li key={u.n} className="py-3">
                      <div className="flex items-start">
                        <span className="text-xs font-bold inline-flex items-center justify-center rounded-full text-flux-700 bg-white shadow w-8 h-8 mr-4 flex-shrink-0 font-mono">
                          {u.n}
                        </span>
                        <div>
                          <h4 className="text-ink-800 font-semibold">{u.t}</h4>
                          <p className="text-ink-500 text-sm leading-relaxed mt-1">
                            {u.d}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-ink-500 mt-4 leading-relaxed border-l-2 border-flux-500 pl-4">
                  The mechanism is borrowed openly — OptNet, cvxpylayers,
                  DiffOpt.jl. What is new is the use: recovering the
                  techno-economic inputs of a real planning model from what it
                  actually did.
                </p>
              </div>
            </div>

            <div className="w-full md:w-6/12 mr-auto px-4 pt-24 md:pt-0">
              <div
                className="max-w-full rounded-lg shadow-xl bg-ink-900 p-8 font-mono text-sm text-ink-200 leading-relaxed"
                style={{
                  transform:
                    "scale(1) perspective(1040px) rotateY(-11deg) rotateX(2deg) rotate(2deg)",
                }}
              >
                <div className="text-ink-400"># recover a hidden CO₂ price</div>
                <div className="mt-3">
                  <span className="text-flux-400">from</span> nexus_energy.pypsa_compat{" "}
                  <span className="text-flux-400">import</span> from_pypsa
                </div>
                <div>
                  <span className="text-flux-400">from</span> nexus_energy.diff_bridge{" "}
                  <span className="text-flux-400">import</span> fit_co2_price
                </div>
                <div className="mt-3">
                  system = from_pypsa(network, line_model=
                  <span className="text-ember-300">&quot;transport&quot;</span>)
                </div>
                <div>fit = fit_co2_price(system, observed_dispatch)</div>
                <div className="mt-3 text-ink-400">
                  # fit.price → 83.4 €/t · fit.n_solves → 12
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="justify-center text-center flex flex-wrap mt-24">
          <div className="w-full md:w-6/12 px-12 md:px-4">
            <h2 className="font-semibold text-4xl text-ink-800">
              Where the coverage stops
            </h2>
            <p className="text-lg leading-relaxed mt-4 mb-4 text-ink-500">
              Today&apos;s libraries help you build and plan. Nexus does that too,
              then adds the two stages that come after the model meets the real
              world.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. NEW — Where the coverage stops ───────────────────── */}
      <section id="coverage" className="block relative z-1 bg-ink-600">
        <div className="container mx-auto">
          <div className="justify-center flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4 -mt-24">
              <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
                <table className="items-center w-full border-collapse min-w-[42rem]">
                  <thead>
                    <tr>
                      {["Stage", "Today's libraries", "Nexus"].map((h) => (
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
                    {STAGES.map((s) => (
                      <tr key={s.n} className="border-b border-ink-200 last:border-0">
                        <td className="px-6 py-4 align-top">
                          <div className="font-semibold text-ink-800 text-sm">
                            <span className="text-ink-300 mr-2">{s.n}</span>
                            {s.title}
                          </div>
                          <div className="text-xs text-ink-400 mt-1 ml-5">{s.sub}</div>
                        </td>
                        <td className="px-6 py-4 align-top"><Mark state={s.today} /></td>
                        <td className="px-6 py-4 align-top"><Mark state={s.nexus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* what stage 4 costs today, in numbers */}
          <div className="flex flex-wrap pt-16 pb-24 text-center">
            {[
              ["426", "solves", "Sobol sampling, to reach 0.1% accuracy"],
              ["12", "solves", "Nexus, recovered exactly — 36× fewer"],
              ["6.3e-10", "gradient error", "vs finite differences, end to end"],
              ["0.000%", "objective gap", "forward parity vs PyPSA on production runs"],
            ].map(([v, unit, note]) => (
              <div key={note} className="w-full sm:w-6/12 lg:w-3/12 px-4 mb-8 lg:mb-0">
                <div className="text-4xl font-bold text-flux-400 font-mono">{v}</div>
                <div className="text-xs uppercase tracking-widest text-white font-bold mt-1">
                  {unit}
                </div>
                <div className="text-sm text-ink-300 mt-2 leading-relaxed">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Where it pays — Notus's dark card grid ───────────── */}
      <section id="where" className="block relative z-1 bg-ink-600">
        <div className="container mx-auto">
          <div className="justify-center text-center flex flex-wrap pt-24">
            <div className="w-full md:w-6/12 px-12 md:px-4">
              <h2 className="font-semibold text-4xl text-white">
                Where it pays
              </h2>
              <p className="text-lg leading-relaxed mt-4 mb-4 text-ink-300">
                Wherever a digital twin has to meet the real world, calibration is
                the tax. These are the desks where an analytic inverse turns an
                overnight study into an interactive one.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap pt-12 pb-24">
            {DESKS.map((d) => (
              <div key={d.role} className="w-full lg:w-4/12 px-4 mb-6 lg:mb-0">
                <div className="bg-ink-700 rounded-lg shadow-lg h-full p-8">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-4 shadow-lg rounded-full bg-flux-500">
                    {d.icon}
                  </div>
                  <h5 className="text-xl font-semibold text-white">{d.role}</h5>
                  <p className="mt-2 mb-4 text-ink-300 leading-relaxed">{d.body}</p>
                  <p className="text-flux-300 font-semibold text-sm">{d.kicker}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Open Source, with the oversized mark ─────────────── */}
      <section id="opensource" className="py-20 bg-ink-600 overflow-hidden">
        <div className="container mx-auto pb-64">
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-5/12 px-12 md:px-4 ml-auto mr-auto md:mt-64 relative z-10">
              <div className={badgeLg}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="8" r="3" />
                  <path d="M6 9v6M18 11c0 4-6 3-6 7" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal text-white">
                Open Source
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-ink-300">
                Both halves of the stack are MIT licensed and developed in the
                open — <span className="text-ink-200">nexus-energy</span> for the
                energy-system layer, and{" "}
                <span className="text-ink-200">nexus-opt</span> for the Rust
                solver core underneath it.
              </p>
              <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-ink-300">
                The benchmark harness and its stored results ship with the
                repository, so every number can be re-run rather than taken on
                trust.
              </p>
              <a
                href="https://github.com/VishalRam24/nexus-energy"
                target="_blank"
                rel="noreferrer"
                className="github-star mt-4 inline-block text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-ink-700 active:bg-ink-600 uppercase text-sm shadow hover:shadow-lg"
              >
                View on GitHub
              </a>
            </div>

            {/*
              Notus sizes this mark with a Font Awesome glyph at 55rem, whose em
              box carries a lot of internal padding. A raw SVG has none, so it is
              set smaller here to occupy the same visual footprint without
              bleeding across the copy to its left.
            */}
            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto mt-32 relative">
              <svg
                viewBox="0 0 496 512"
                fill="currentColor"
                className="text-ink-700 absolute left-auto opacity-80 hidden md:block"
                style={{ top: "-120px", right: "-200px", width: "46rem", height: "47.5rem" }}
                aria-hidden="true"
              >
                <path d={GITHUB_PATH} />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Closing CTA card ─────────────────────────────────── */}
      <section id="install" className="pb-16 bg-ink-200 relative pt-32">
        <div
          className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon className="text-ink-200 fill-current" points="2560 0 2560 100 0 100" />
          </svg>
        </div>

        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center bg-white shadow-xl rounded-lg -mt-64 py-16 px-8 md:px-12 relative z-10">
            <div className="w-full text-center lg:w-10/12">
              <p className="text-4xl text-center">
                <span role="img" aria-label="plug">
                  🔌
                </span>
              </p>
              <h3 className="font-semibold text-3xl text-ink-800">
                Two packages, one install.
              </h3>
              <p className="text-ink-500 text-lg leading-relaxed mt-4 mb-8 max-w-2xl mx-auto">
                Installing <span className="font-mono">nexus-energy</span> pulls in
                the <span className="font-mono">nexus-opt</span> Rust core
                automatically — no separate step, no Rust toolchain.
              </p>

              <div className="max-w-2xl mx-auto">
                <CodeBlock code="pip install nexus-energy" />
                <p className="text-sm text-ember-600 mt-3 font-semibold text-left">
                  PyPI release pending — the wheel matrix is built and verified,
                  but the packages are not published yet.
                </p>
              </div>

              <div className="flex flex-wrap mt-12 -mx-3 text-left">
                <div className="w-full lg:w-6/12 px-3 mb-6 lg:mb-0">
                  <CodeBlock
                    label="Economic dispatch in eight lines"
                    code={`import nexus_energy as ne

sys = ne.EnergySystem("my_system")
elec = sys.add_bus("elec", carrier="electricity")

sys.add_generator("solar", bus=elec, capacity=500, marginal_cost=0)
sys.add_generator("gas",   bus=elec, capacity=200, marginal_cost=50)
sys.add_load("demand", bus=elec, amount=300)

result = sys.optimise()
print(result.status, result.total_cost)
# optimal 0.0`}
                  />
                </div>
                <div className="w-full lg:w-6/12 px-3">
                  <CodeBlock
                    label="Recovering a hidden CO₂ price"
                    code={`from nexus_energy.pypsa_compat import from_pypsa
from nexus_energy.diff_bridge import fit_co2_price

# any PyPSA network — no PyPSA needed to solve
system = from_pypsa(network, line_model="transport")

fit = fit_co2_price(system, observed_dispatch)

print(fit.price, fit.n_solves, fit.converged)
# 83.4  12  True`}
                  />
                </div>
              </div>

              <div className="sm:block flex flex-col mt-10">
                <a
                  href="https://github.com/VishalRam24/nexus-energy"
                  target="_blank"
                  rel="noreferrer"
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-flux-500 active:bg-flux-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  nexus-energy
                </a>
                <a
                  href="https://github.com/VishalRam24/nexus-opt"
                  target="_blank"
                  rel="noreferrer"
                  className="github-star sm:ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-ink-700 active:bg-ink-600 uppercase text-sm shadow hover:shadow-lg"
                >
                  nexus-opt
                </a>
              </div>
              <div className="text-center mt-16"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
