/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.jsx",
    "./assets/**/**/*.jsx",
    "./templates/**/*.html.twig",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px) translateX(-50%)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
      utilities: {
        '.backface-hidden': {
          'backface-visibility': 'hidden',
          '-moz-backface-visibility': 'hidden',
          '-webkit-backface-visibility': 'hidden',
          '-ms-backface-visibility': 'hidden'
        },
      },
    },
  },
  plugins: [],
}

