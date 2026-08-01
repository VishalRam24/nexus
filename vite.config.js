import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// Served from https://vishalram24.github.io/nexus/ — GitHub Pages puts a
// project site under /<repo>/, so assets must be requested from that prefix.
//
// Two entry points: the landing page and the documentation. Giving the docs
// its own `docs/index.html` means Pages serves it at /nexus/docs/ as a real
// URL, with no SPA fallback or 404 rewrite to configure.
export default defineConfig({
  plugins: [react()],
  base: "/nexus/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(here, "index.html"),
        docs: resolve(here, "docs/index.html"),
      },
    },
  },
});
