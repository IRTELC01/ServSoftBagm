/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#E85050',
          blue: '#784ba0',
          cyan: '#2b86c5',
          green: '#98CA3F',
          yellow: '#F0C040',
        },
      },
      boxShadow: {
        glow: '0 0 8px rgba(152,202,63,0.15), 0 4px 12px rgba(0,0,0,0.3)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)'
      }
    },
  },
  plugins: [],
}