import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        imet: {
          aqua: "#14B8A6",
          "aqua-light": "#5EEAD4",
          "aqua-dark": "#0F766E",
          "aqua-deep": "#134E4A",
          mint: "#CCFBF1",
          navy: "#1E3A5F",
          "navy-light": "#2A4F7C",
          cream: "#F8FAF9",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in": "fadeIn 0.8s ease-out",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        "shine-sweep": "shineSweep 3.5s ease-in-out infinite",
        "slide-up-in": "slideUpIn 0.4s ease-out",
        "countdown-pulse": "countdownPulse 1s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow:
              "0 0 0 0 rgba(20, 184, 166, 0.55), 0 10px 28px rgba(20, 184, 166, 0.35)",
          },
          "50%": {
            boxShadow:
              "0 0 0 14px rgba(20, 184, 166, 0), 0 14px 36px rgba(20, 184, 166, 0.5)",
          },
        },
        shineSweep: {
          "0%": { transform: "translateX(-150%) skewX(-12deg)" },
          "40%, 100%": { transform: "translateX(250%) skewX(-12deg)" },
        },
        slideUpIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        countdownPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
