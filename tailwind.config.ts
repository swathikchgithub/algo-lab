import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        navy: {
          DEFAULT: "#0a0e1a",
          900: "#0a0e1a",
          800: "#111729",
          700: "#1a2236",
          600: "#243049",
        },
        // Cell / pointer states
        cell: {
          active: "#3b82f6", // blue — active / window
          current: "#f59e0b", // amber/gold — current / mid
          visited: "#475569", // dimmed — visited / discarded
        },
        diff: {
          easy: "#22c55e",
          medium: "#f59e0b",
          hard: "#ef4444",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
