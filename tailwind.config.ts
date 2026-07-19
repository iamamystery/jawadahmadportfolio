import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        night: "#070B12",
        surface: "#111827",
        ink: "#F8FAFC",
        gold: "#D4A574",
        ember: "#FF6B35",
        // Hero palette — neutral charcoal base + deeper copper for hairlines.
        charcoal: "#080A0D",
        copper: "#B87333",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.32em",
      },
      backgroundImage: {
        "gold-line":
          "linear-gradient(90deg, transparent, rgba(212,165,116,0.55), transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
