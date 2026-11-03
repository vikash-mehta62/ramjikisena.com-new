import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Devotional brand palette
        maroon: { DEFAULT: "#581404", deep: "#3D0C02", light: "#8C2206" },
        gold: { DEFAULT: "#D4AF37", light: "#FBE192", soft: "#F3CF7A" },
        cream: { DEFAULT: "#FFFDF8", warm: "#FFF8EE" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "var(--font-serif)", "serif"],
      },
      // Used across the app but only built into Tailwind v4 — defined here so they render
      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(88, 20, 4, 0.05)",
        xs: "0 1px 3px 0 rgba(88, 20, 4, 0.08), 0 1px 2px -1px rgba(88, 20, 4, 0.06)",
        divine: "0 10px 30px -10px rgba(212, 175, 55, 0.45)",
      },
      scale: {
        "102": "1.02",
      },
      spacing: {
        "18": "4.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
