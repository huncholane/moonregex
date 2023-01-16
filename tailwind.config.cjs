/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        re101: [
          "Open Sans",
          "Helvetica",
          "Lucida Sans Unicode",
          "Lucida Grande",
          "Arial",
          "Verdana",
          "sansSerif",
        ],
        "re101-input": ["Source Code Pro", "monospace"],
      },
    },
    fontSize: {
      input: "15.2px",
    },
  },
  plugins: [],
};
