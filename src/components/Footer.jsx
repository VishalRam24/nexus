import React from "react";
import { AngledDivider, Icons } from "./ui.jsx";

export default function Footer() {
  return (
    <footer className="relative bg-ink-100 pt-24 pb-8">
      <AngledDivider colorClass="text-ink-100" flip />

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <h4 className="text-3xl font-semibold text-ink-800">
              Take the twin to the real world.
            </h4>
            <p className="text-lg mt-2 mb-6 text-ink-500 leading-relaxed lg:w-10/12">
              Nexus combines exact-parity solving, differentiable inverse
              calibration, identifiability honesty and self-calibrating control.
              The inverse core exists nowhere else.
            </p>
            <div className="flex gap-2">
              <a
                href="https://github.com/VishalRam24/nexus-energy"
                target="_blank"
                rel="noreferrer"
                className="bg-white text-ink-800 shadow-lg hover:shadow-xl font-normal h-10 w-10 items-center justify-center flex rounded-full outline-none focus:outline-none transition-shadow"
                aria-label="nexus-energy on GitHub"
              >
                {Icons.github}
              </a>
            </div>
          </div>

          <div className="w-full lg:w-6/12 px-4">
            <div className="flex flex-wrap items-top mb-6">
              <div className="w-full lg:w-4/12 px-4 ml-auto">
                <span className="block uppercase text-ink-500 text-sm font-semibold mb-2">
                  Packages
                </span>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="text-ink-600 hover:text-flux-600 font-semibold block pb-2 text-sm"
                      href="https://github.com/VishalRam24/nexus-energy"
                      target="_blank" rel="noreferrer"
                    >
                      nexus-energy
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-ink-600 hover:text-flux-600 font-semibold block pb-2 text-sm"
                      href="https://github.com/VishalRam24/nexus-opt"
                      target="_blank" rel="noreferrer"
                    >
                      nexus-opt
                    </a>
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <span className="block uppercase text-ink-500 text-sm font-semibold mb-2">
                  On this page
                </span>
                <ul className="list-unstyled">
                  {[
                    ["#problem", "The problem"],
                    ["#compare", "Comparison"],
                    ["#benchmarks", "Benchmarks"],
                    ["#install", "Install"],
                  ].map(([h, l]) => (
                    <li key={h}>
                      <a
                        className="text-ink-600 hover:text-flux-600 font-semibold block pb-2 text-sm"
                        href={h}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-ink-300" />

        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-6/12 px-4 mx-auto text-center md:text-left">
            <div className="text-sm text-ink-500 py-1">
              Nexus · Gradient-based inverse techno-economic calibration of
              energy-system models. MIT licensed.
            </div>
          </div>
          <div className="w-full md:w-6/12 px-4 mx-auto text-center md:text-right">
            <div className="text-sm text-ink-400 py-1">
              Page design based on{" "}
              <a
                href="https://github.com/creativetimofficial/notus-react"
                target="_blank"
                rel="noreferrer"
                className="text-ink-500 hover:text-flux-600"
              >
                Notus React
              </a>{" "}
              © 2021{" "}
              <a
                href="https://www.creative-tim.com"
                target="_blank"
                rel="noreferrer"
                className="text-ink-500 hover:text-flux-600"
              >
                Creative Tim
              </a>{" "}
              (MIT).
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
