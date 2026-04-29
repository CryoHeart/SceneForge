import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        scene: {
          950: "#070707",
          900: "#111114",
          800: "#1a1a1f",
          700: "#25252d",
          accent: "#e11d48",
          glow: "#a21caf",
          steel: "#94a3b8"
        }
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        noise: "radial-gradient(circle at 10% 20%, rgba(225,29,72,0.15), transparent 30%), radial-gradient(circle at 85% 10%, rgba(162,28,175,0.18), transparent 35%), linear-gradient(135deg, #070707 0%, #111114 45%, #1a1a1f 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
