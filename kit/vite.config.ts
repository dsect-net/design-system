import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dir = import.meta.dirname;
const reactDir = resolve(dir, "node_modules/react");
const reactDomDir = resolve(dir, "node_modules/react-dom");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // One React. The components live outside this package, and a second copy breaks hooks.
    dedupe: ["react", "react-dom"],
    alias: [
      { find: "@", replacement: resolve(dir, "src") },
      { find: /^react-dom\/(.*)$/, replacement: `${reactDomDir}/$1` },
      { find: /^react-dom$/, replacement: reactDomDir },
      { find: /^react\/(.*)$/, replacement: `${reactDir}/$1` },
      { find: /^react$/, replacement: reactDir },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
    fs: { allow: [resolve(dir, "..")] },
  },
  build: { outDir: "dist", emptyOutDir: true },
});
