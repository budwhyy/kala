import { defineConfig } from "vitest/config";

export default defineConfig({
  // PGlite + PostGIS boot takes a few seconds.
  test: { testTimeout: 60_000, hookTimeout: 120_000 },
});
