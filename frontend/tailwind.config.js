/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#000000',
        'dark-surface': '#111111',
        'dark-border': '#333333',
        'dark-text-primary': '#ffffff',
        'dark-text-secondary': '#888888',
      },
    },
  },
  plugins: [],
};
