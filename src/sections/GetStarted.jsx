import React from "react";
import { AngledDivider, Icons } from "../components/ui.jsx";

function Code({ children }) {
  return (
    <pre className="bg-ink-900 text-ink-200 rounded-lg p-5 overflow-x-auto text-sm font-mono leading-relaxed border border-ink-700">
      {children}
    </pre>
  );
}

export default function GetStarted() {
  return (
    <section id="install" className="relative py-24 bg-ink-800">
      <AngledDivider colorClass="text-ink-800" flip />

      <div className="container mx-auto px-4 pt-8">
        <div className="flex flex-wrap items-start">
          <div className="w-full lg:w-5/12 px-4 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-flux-400">
              Get started
            </span>
            <h2 className="text-4xl font-semibold text-white mt-3">
              Two packages, one install.
            </h2>
            <p className="text-ink-300 mt-4 leading-relaxed">
              <span className="font-mono text-flux-300">nexus-energy</span> is the
              energy-system layer.{" "}
              <span className="font-mono text-flux-300">nexus-opt</span> is the
              Rust solver core underneath it. Installing the first pulls in the
              second automatically — there is no separate step and no Rust
              toolchain needed.
            </p>

            <div className="mt-6 rounded-lg border-l-4 border-ember-500 bg-ember-300/10 p-5">
              <div className="flex items-start gap-3">
                <span className="text-ember-400 mt-0.5 flex-shrink-0">
                  {Icons.warn}
                </span>
                <p className="text-ink-200 text-sm leading-relaxed">
                  <span className="font-semibold text-white">
                    PyPI release pending.
                  </span>{" "}
                  The wheel build matrix is in place and verified, but the
                  packages are not published to PyPI yet — so the{" "}
                  <span className="font-mono">pip install nexus-energy</span> form
                  below will not resolve today. Install from source in the
                  meantime.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href="https://github.com/VishalRam24/nexus-energy"
                target="_blank"
                rel="noreferrer"
                className="text-white font-bold px-6 py-4 rounded bg-flux-500 hover:bg-flux-600 uppercase text-sm shadow hover:shadow-lg transition-all duration-150 inline-flex items-center gap-2"
              >
                {Icons.github} nexus-energy
              </a>
              <a
                href="https://github.com/VishalRam24/nexus-opt"
                target="_blank"
                rel="noreferrer"
                className="text-white font-bold px-6 py-4 rounded bg-ink-700 hover:bg-ink-600 uppercase text-sm shadow hover:shadow-lg transition-all duration-150 inline-flex items-center gap-2"
              >
                {Icons.github} nexus-opt
              </a>
            </div>
          </div>

          <div className="w-full lg:w-7/12 px-4">
            <p className="text-xs uppercase tracking-widest font-bold text-ink-400 mb-3">
              Once published
            </p>
            <Code>{`pip install nexus-energy   # pulls in nexus-opt automatically`}</Code>

            <p className="text-xs uppercase tracking-widest font-bold text-ink-400 mt-8 mb-3">
              From source, today
            </p>
            <Code>{`git clone https://github.com/VishalRam24/nexus-opt
cd nexus-opt && maturin build --release   # needs a Rust toolchain
pip install target/wheels/*.whl

git clone https://github.com/VishalRam24/nexus-energy
cd nexus-energy && pip install -e .`}</Code>

            <p className="text-xs uppercase tracking-widest font-bold text-ink-400 mt-8 mb-3">
              Economic dispatch in eight lines
            </p>
            <Code>{`import nexus_energy as ne

sys = ne.EnergySystem("my_system")
elec = sys.add_bus("elec", carrier="electricity")

sys.add_generator("solar", bus=elec, capacity=500, marginal_cost=0)
sys.add_generator("gas",   bus=elec, capacity=200, marginal_cost=50)
sys.add_load("demand", bus=elec, amount=300)

result = sys.optimise()
print(result.status, result.total_cost)
# optimal 0.0`}</Code>

            <p className="text-xs uppercase tracking-widest font-bold text-ink-400 mt-8 mb-3">
              Recovering a hidden CO₂ price
            </p>
            <Code>{`from nexus_energy.pypsa_compat import from_pypsa
from nexus_energy.diff_bridge import fit_co2_price

system = from_pypsa(network, line_model="transport")
fit = fit_co2_price(system, observed_dispatch)

print(fit.price, fit.n_solves, fit.converged)`}</Code>
          </div>
        </div>
      </div>
    </section>
  );
}
