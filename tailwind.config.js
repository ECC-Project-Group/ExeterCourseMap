module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        exeter: {
          DEFAULT: '#9A1D2E',
          50: '#E88694',
          100: '#E57584',
          200: '#DF5366',
          300: '#D83047',
          400: '#BC2338',
          500: '#9A1D2E',
          600: '#6B1420',
          700: '#3C0B12',
          800: '#0C0204',
          900: '#000000',
        },
      },
      fontFamily: {
        display: ['Inter'],
        mono: ['JetBrains Mono'],
      },
    },
  },
  plugins: [],
};
