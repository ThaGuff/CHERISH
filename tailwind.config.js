/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cherish: {
          50: "#fffaf7",
          100: "#fff3ef",
          200: "#fde8d0",
          300: "#f5c4b3",
          400: "#e8a060",
          500: "#c84820",
          600: "#993c1d",
          700: "#712b13",
          800: "#5a2010",
          900: "#2c1a0a",
        },
        snap: { light: "#fff3e8", border: "#f5d5b5", text: "#7a3010", icon: "#fde8d0" },
        journal: { light: "#f0f4ff", border: "#c8d5f5", text: "#1a3880", icon: "#dce6ff" },
        scrap: { light: "#f0faf2", border: "#b8e8c5", text: "#1a5a30", icon: "#d0f0d8" },
        full: { light: "#fdf0ff", border: "#e0c0f0", text: "#5a1880", icon: "#efd8ff" },
        vision: { light: "#fff8e8", border: "#f0d890", text: "#6a4a00", icon: "#fdefc0" },
        creative: { light: "#f0f8ff", border: "#b0d5f8", text: "#0a3870", icon: "#d0eaff" },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        hand: ["'Caveat'", "cursive"],
      },
      borderRadius: {
        card: "14px",
        phone: "36px",
      },
    },
  },
  plugins: [],
};
