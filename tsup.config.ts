import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/vercel.ts"],
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: "api",
  external: ["pg-native"],
  // Ensure CommonJS-style requires in bundled deps work in ESM output.
  banner: {
    js: "import { createRequire } from \"module\"; const require = createRequire(import.meta.url);",
  },
});
