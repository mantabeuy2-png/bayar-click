import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bayar: {
          "primary": "#3b7ddd",
          "primary-content": "#ffffff",
          "secondary": "#10b981",
          "secondary-content": "#ffffff",
          "accent": "#6366f1",
          "neutral": "#0d1526",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#0d1526",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.75rem",
        },
      },
    ],
  },
} satisfies Config;
