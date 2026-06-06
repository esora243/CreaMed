import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kokoro: {
          bg: "#FFF9FA",
          beige: "#FAF3E8",
          peach: "#F5C6BA",
          orange: "#F4B886",
          green: "#D4E4D0",
          ink: "#4A4A4A",
          mute: "#8C8C8C",
          alert: "#C97B63",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', "system-ui", "sans-serif"],
      },
      animation: {
        breathe: "breathe 4s ease-in-out infinite",
        ripple: "ripple 1.6s ease-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
