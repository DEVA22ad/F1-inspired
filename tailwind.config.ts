import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#050505",
        "bg-surface": "#0b0b0b",
        "text-primary": "#ffffff",
        "text-secondary": "#90949d",
        "text-muted": "#4e525a",
        "accent-red": "#e10600",
        "accent-red-glow": "rgba(225, 6, 0, 0.4)",
        "border-subtle": "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        display: ["var(--font-barlow-condensed)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
