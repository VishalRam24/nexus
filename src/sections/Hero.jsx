import React from "react";

/** Stand-in for Notus's offset pattern_react.png — an energy network graph. */
function NetworkPattern() {
  const nodes = [
    [120, 90], [260, 55], [390, 120], [95, 220], [235, 195],
    [370, 250], [150, 340], [300, 355], [420, 400], [200, 460],
  ];
  const edges = [
    [0, 1], [1, 2], [0, 3], [0, 4], [1, 4], [2, 5], [4, 5],
    [3, 6], [4, 7], [5, 8], [6, 7], [7, 8], [6, 9], [7, 9],
  ];
  return (
    <svg viewBox="0 0 520 520" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="url(#edge)" strokeWidth="2"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="16" fill="#14b8a6" opacity="0.12" />
          <circle cx={x} cy={y} r="7" fill="#0d9488" />
        </g>
      ))}
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="header relative pt-16 items-center flex h-screen max-h-860-px header-bg overflow-hidden"
    >
      <div className="container mx-auto items-center flex flex-wrap">
        <div className="w-full md:w-8/12 lg:w-7/12 xl:w-6/12 px-4">
          <div className="pt-32 sm:pt-0">
            <span className="text-xs font-bold uppercase tracking-widest text-flux-600">
              Differentiable energy-system optimisation
            </span>
            <h2 className="font-semibold text-4xl md:text-5xl text-ink-800 mt-4 leading-tight">
              Energy models that answer backwards.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-500">
              Your model says what the plan should be. Nexus says{" "}
              <span className="text-ink-700 font-semibold">
                which assumption is wrong
              </span>
              . Every planning tool answers forward: given the costs, here is the
              optimal plan. The expensive daily question is the reverse.
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              <a
                href="#install"
                className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none bg-flux-500 hover:bg-flux-600 active:bg-flux-700 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
              >
                Get started
              </a>
              <a
                href="#compare"
                className="text-white font-bold px-6 py-4 rounded outline-none focus:outline-none bg-ink-800 hover:bg-ink-700 active:bg-ink-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
              >
                See what&apos;s different
              </a>
            </div>

            {/* The headline result, stated as a comparison. */}
            <div className="mt-12 bg-white rounded-lg shadow-lg p-6 max-w-xl">
              <p className="text-xs uppercase tracking-widest font-bold text-ink-400">
                Recovering a hidden carbon price · PyPSA-Eur, 336 h
              </p>
              <div className="flex items-center flex-wrap mt-4">
                <div className="pr-6">
                  <div className="text-5xl font-bold text-flux-600">12</div>
                  <div className="text-sm text-ink-500 mt-1">
                    Nexus solves,
                    <br />
                    recovered exactly
                  </div>
                </div>
                <div className="text-ink-300 font-semibold px-2">vs</div>
                <div className="pl-6">
                  <div className="text-5xl font-bold text-ink-400">426</div>
                  <div className="text-sm text-ink-500 mt-1">
                    Sobol solves for
                    <br />
                    0.1% accuracy
                  </div>
                </div>
              </div>
              <p className="text-sm text-ink-500 mt-4 leading-relaxed">
                One analytic backward pass replaces the sampling sweep —{" "}
                <span className="font-semibold text-ink-700">
                  36× fewer solves
                </span>
                , and the exactness sampling never reaches.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860-px opacity-70 sm:opacity-100 pointer-events-none">
        <NetworkPattern />
      </div>
    </section>
  );
}
