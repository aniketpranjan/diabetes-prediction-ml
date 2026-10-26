/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        medical: {
          blue: '#1d4ed8',
          teal: '#0d9488',
          emerald: '#059669',
          rose: '#e11d48',
          amber: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-rose': '0 0 20px -5px rgba(225, 29, 72, 0.35)',
        'glow-emerald': '0 0 20px -5px rgba(5, 150, 105, 0.35)',
      }
    },
  },
  plugins: [],
}
