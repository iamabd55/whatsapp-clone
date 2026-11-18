/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          white: '#FFFFFF',
          black: '#000000',
          green: '#008069',
          lightGreen: '#00A884',
          teal: '#128C7E',
          darkTeal: '#075E54',
          blue: '#34B7F1',
          light: '#25D366',
          darkBackground: '#0B141A',
          darkHeader: '#1F2C34',
        },
      },
    },
  },
  plugins: [],
};
