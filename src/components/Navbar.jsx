import React, { useState } from "react";
import { Icons, NexusMark } from "./ui.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const LINKS = [
  { href: "#what", label: "What it is" },
  { href: "#coverage", label: "Coverage" },
  { href: "#where", label: "Where it pays" },
  { href: "#opensource", label: "Open source" },
  { href: "#install", label: "Install" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <a
            href="#top"
            className="text-ink-800 text-sm font-bold leading-relaxed inline-flex items-center gap-2 mr-4 py-2 whitespace-nowrap uppercase tracking-widest"
          >
            <NexusMark className="w-5 h-5" />
            Nexus
          </a>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-ink-700">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div
          className={
            "lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none " +
            (open ? "block rounded shadow-lg" : "hidden")
          }
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto items-center">
            {LINKS.map((l) => (
              <li key={l.href} className="flex items-center">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-ink-600 hover:text-flux-600 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="flex items-center">
              <ThemeToggle />
            </li>
            <li className="flex items-center">
              <a
                href="https://github.com/VishalRam24/nexus-energy"
                target="_blank"
                rel="noreferrer"
                className="bg-ink-800 text-white active:bg-ink-700 text-xs font-bold uppercase px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150 inline-flex items-center gap-2"
              >
                {Icons.github} GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
