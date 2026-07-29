import React from "react";

/**
 * Design primitives lifted from the Notus React landing page (Creative Tim,
 * MIT) — the angled polygon section divider, the round icon badge and the
 * card-with-polygon-overlay. Geometry and sizing are unchanged; only the
 * palette differs.
 */

/** The angled polygon that Notus uses to break between sections. */
export function AngledDivider({ colorClass = "text-ink-100", flip = false }) {
  return (
    <div
      className={
        "top-0 bottom-auto left-0 right-0 w-full absolute h-20 " +
        (flip ? "-mt-20" : "-mt-20")
      }
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
        <polygon
          className={colorClass + " fill-current"}
          points={flip ? "2560 0 2560 100 0 100" : "0 0 2560 0 2560 100"}
        />
      </svg>
    </div>
  );
}

/** Notus's rounded-full icon badge. */
export function IconBadge({ children, tone = "light", size = "md" }) {
  const dims = size === "lg" ? "w-16 h-16 mb-6" : "w-12 h-12 mb-5";
  const tones = {
    light: "text-flux-600 bg-white",
    flux: "text-white bg-flux-500",
    ink: "text-white bg-ink-800",
    ember: "text-white bg-ember-500",
  };
  return (
    <div
      className={
        "p-3 text-center inline-flex items-center justify-center shadow-lg rounded-full " +
        dims +
        " " +
        tones[tone]
      }
    >
      {children}
    </div>
  );
}

/** Small uppercase pill, used by Notus for tag lists. */
export function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "text-ink-600 bg-white",
    flux: "text-flux-700 bg-flux-300/40",
    ember: "text-ember-600 bg-ember-300/40",
  };
  return (
    <span
      className={
        "text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full last:mr-0 mr-2 mt-2 " +
        tones[tone]
      }
    >
      {children}
    </span>
  );
}

/** Section eyebrow + title + lede, matching Notus's centred section headers. */
export function SectionHeading({ eyebrow, title, lede, dark = false }) {
  return (
    <div className="flex flex-wrap justify-center text-center mb-16">
      <div className="w-full lg:w-8/12 px-4">
        {eyebrow && (
          <span
            className={
              "text-xs font-bold uppercase tracking-widest " +
              (dark ? "text-flux-400" : "text-flux-600")
            }
          >
            {eyebrow}
          </span>
        )}
        <h2
          className={
            "text-4xl font-semibold mt-3 " +
            (dark ? "text-white" : "text-ink-800")
          }
        >
          {title}
        </h2>
        {lede && (
          <p
            className={
              "text-lg leading-relaxed m-4 " +
              (dark ? "text-ink-300" : "text-ink-500")
            }
          >
            {lede}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---- Inline SVG icons (no icon-font dependency, unlike Notus's Font Awesome) ---- */

export const Icons = {
  bug: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M8 6a4 4 0 118 0M6 10h12M5 14h14M9 6v12a3 3 0 006 0V6" strokeLinecap="round" />
    </svg>
  ),
  loop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M4 12a8 8 0 0113.7-5.6M20 12a8 8 0 01-13.7 5.6" strokeLinecap="round" />
      <path d="M17 3v4h-4M7 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M13 2L5 13h6l-1 9 8-11h-6l1-9z" strokeLinejoin="round" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M8.2 6h7.6M6 8.2v7.6M18 8.2v7.6M8.2 18h7.6" strokeLinecap="round" />
    </svg>
  ),
  scale: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 3v18M4 7h16M7 7l-3 6h6L7 7zM17 7l-3 6h6l-3-6z" strokeLinejoin="round" />
    </svg>
  ),
  factory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M3 21V10l6 4V10l6 4V6h6v15z" strokeLinejoin="round" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  cross: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
  warn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 3l9.5 17h-19L12 3z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17.5v.01" strokeLinecap="round" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .5z" />
    </svg>
  ),
};
