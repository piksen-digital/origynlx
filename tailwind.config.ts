import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        paper: "#F5F5F0",
        seal: {
          DEFAULT: "#C9A227",
          dim: "#8A701D",
        },
        fail: "#C24B3F",
        pass: "#3E8E5C",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        content: "1400px",
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
