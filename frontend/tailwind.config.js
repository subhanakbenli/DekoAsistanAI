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
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
        'gradient-x': 'gradient-x 2s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          }
        }
      },
      backgroundSize: {
        '200': '200% 200%',
      }
    },
  },
  plugins: [],
}
