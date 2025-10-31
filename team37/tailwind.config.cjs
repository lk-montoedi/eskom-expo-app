/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'spin-orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'spin-orbit': 'spin-orbit 12s linear infinite',
        'spin-slow': 'spin 4s linear infinite',
        
      },
       fontFamily: {
         playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
});
