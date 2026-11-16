/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F4EDE1',
          soft: '#FBF8F2',
          white: '#FFFFFF',
        },
        espresso: {
          DEFAULT: '#29211D',
          muted: '#817366',
        },
        champagne: {
          DEFAULT: '#C18C55',
          light: '#D9AD7E',
          dark: '#9D6D3B',
        },
        sage: {
          DEFAULT: '#657B65',
          light: '#869B86',
          soft: '#EDF2ED',
        },
        terracotta: {
          DEFAULT: '#B8755C',
          light: '#D1937D',
          soft: '#F7EBE6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

