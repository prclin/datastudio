/** @type {import('tailwindcss').Config} */

const baseSize = 0.25;
const sizes = Object.fromEntries(
  Array.from({ length: 1000 }, (_, i) => [i * 0.5, i * 0.5 * baseSize + "rem"]),
);

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: sizes,
      maxWidth: sizes,
      maxHeight: sizes,
      height: sizes,
      flexBasis: sizes,
    },
  },
  plugins: [],
};
