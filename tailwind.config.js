/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#111827",
      },
      spacing: {
        "1vh": "1vh",
        "2vh": "2vh",
        "4vh": "4vh",
        "5vh": "5vh",
        "10vh": "10vh",
        "30vh": "30vh",
        "90vh": "90vh",
        "95vh": "95vh",
      },
    },
  },
  plugins: [],
};
