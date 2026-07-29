import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://vishalram24.github.io/nexus/ — GitHub Pages puts a
// project site under /<repo>/, so assets must be requested from that prefix.
export default defineConfig({
  plugins: [react()],
  base: "/nexus/",
});
