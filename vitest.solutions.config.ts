import { defineConfig } from "vitest/config";
import path from "node:path";

// Separate suite for verifying the displayed solution code by executing it
// through a real interpreter (python3). Kept apart from the fast unit run
// because it shells out and is environment-dependent. Run: npm run test:solutions
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/solutions/**/*.test.ts"],
    // External processes are slow; give each case room beyond the 5s default.
    testTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
