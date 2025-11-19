/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
      },
      colors: {
        'js-bg': '#F8F9FA',
        'js-bg-soft': '#FAFAFA',
        'js-surface': '#FFFFFF',
        'js-text': '#0A0A0A',
        'js-text-muted': '#6A6A6A',
        'js-text-soft': '#A0A0A0',
        'js-blue': '#3E7BFA',
        'js-purple': '#A070FF',
        'js-aqua': '#55E6FF',
      },
      backgroundImage: {
        'js-gradient': 'linear-gradient(135deg, #3E7BFA 0%, #A070FF 100%)',
        'js-gradient-soft': 'linear-gradient(135deg, rgba(62,123,250,0.12), rgba(160,112,255,0.12))',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

