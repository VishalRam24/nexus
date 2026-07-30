/** @type {import('tailwindcss').Config} */
// Palette note: the layout and component design follow Notus React
// (Creative Tim, MIT). Notus's own `blueGray` neutral and `lightBlue` accent
// are replaced by the Nexus palette — `ink` (graphite neutral), `flux` (teal
// accent) and `ember` (amber, reserved for caveats).
//
// `ink` and `white` are driven by CSS custom properties (see src/index.css) so
// every ramp can be inverted for dark mode in one place: every existing
// `bg-white` / `text-ink-800` / `text-flux-300` flips without touching a single
// utility class. The accents keep their hue and only mirror their lightness,
// so `text-flux-300` stays legible whichever surface it lands on.
const tok = (name) => (n) => `rgb(var(--${name}-${n}) / <alpha-value>)`;
const ink = tok("ink");
const flux = tok("flux");
const ember = tok("ember");

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        white: "rgb(var(--white) / <alpha-value>)",
        ink: {
          100: ink(100),
          200: ink(200),
          300: ink(300),
          400: ink(400),
          500: ink(500),
          600: ink(600),
          700: ink(700),
          800: ink(800),
          900: ink(900),
        },
        flux: {
          300: flux(300),
          400: flux(400),
          500: flux(500),
          600: flux(600),
          700: flux(700),
          800: flux(800),
        },
        ember: {
          300: ember(300),
          400: ember(400),
          500: ember(500),
          600: ember(600),
        },
      },
      maxHeight: {
        "860-px": "860px",
      },
      height: {
        "95-px": "95px",
      },
      inset: {
        "-94-px": "-94px",
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
