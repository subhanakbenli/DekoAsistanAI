/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem', // 10px for very small hashtags
      },
    },
  },
  plugins: [],
}
