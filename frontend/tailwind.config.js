/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#07080a", 900: "#0e1014", 800: "#151719",
          700: "#1d2025", 600: "#272b31", 500: "#383d45",
          400: "#525966", 300: "#7c8797", 200: "#adb5be",
          100: "#d5dae0", 50: "#eef0f3",
        },
        lime: { 300: "#d9ff5a", 400: "#c8ff00", 500: "#a3cc00" },
        sky:  { 400: "#38bdf8", 500: "#0ea5e9" },
        rose: { 400: "#fb7185", 500: "#f43f5e" },
        gold: { 400: "#fbbf24", 500: "#f59e0b" },
        teal: { 400: "#2dd4bf", 500: "#14b8a6" },
        violet: { 400: "#a78bfa", 500: "#8b5cf6" },
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "none" } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        shimmer:  { "0%": { backgroundPosition: "-600px 0" }, "100%": { backgroundPosition: "600px 0" } },
        bounce3:  { "0%,80%,100%": { transform: "translateY(0)" }, "40%": { transform: "translateY(-6px)" } },
      },
      animation: {
        "fade-up": "fadeUp 0.3s ease-out both",
        "fade-in": "fadeIn 0.2s ease-out both",
        shimmer:   "shimmer 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};
