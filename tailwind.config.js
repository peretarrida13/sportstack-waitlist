/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050D18',
          900: '#0D1B2A',
          800: '#122236',
          700: '#1A3C5E',
        },
        gold: {
          400: '#E2B93B',
          500: '#D4A017',
          600: '#B8860F',
        },
      },
    },
  },
  plugins: [],
}
