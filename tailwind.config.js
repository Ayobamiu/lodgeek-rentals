/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        stone: colors.warmGray,
        sky: colors.lightBlue,
        neutral: colors.trueGray,
        coolGray: colors.coolGray,
        slate: colors.blueGray,
      },
    },
  },
  plugins: [],
};
