module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "../../packages/ui/**/*.{js,jsx,ts,tsx}"
  ],
  theme: { extend: {} },
  plugins: [require("tailwindcss-animate")],
};