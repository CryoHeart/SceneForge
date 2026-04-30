import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#09090b",
        panel: "#121218",
        panelSoft: "#171722",
        accent: "#ef4444",
        accentAlt: "#a855f7",
        text: "#f4f4f5",
        muted: "#a1a1aa",
      },
      boxShadow: {
        glow: "0 12px 40px rgba(239, 68, 68, 0.2)",
        purpleGlow: "0 16px 45px rgba(168, 85, 247, 0.22)",
      },
      backgroundImage: {
        "metal-grid":
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
