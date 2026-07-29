/** @type {import('tailwindcss').Config} */
// Palette note: the layout and component design follow Notus React
// (Creative Tim, MIT). Notus's own `blueGray` neutral and `lightBlue` accent
// have been replaced by the Nexus palette below — `ink` (graphite neutral),
// `flux` (teal accent) and `ember` (amber, reserved for caveats/warnings).
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          100: "#f2f4f8",
          200: "#e3e7f0",
          300: "#c8cfe0",
          400: "#98a2bb",
          500: "#6c7793",
          600: "#4a5573",
          700: "#2f3852",
          800: "#1c2337",
          900: "#111725",
        },
        flux: {
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
        },
        ember: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
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
