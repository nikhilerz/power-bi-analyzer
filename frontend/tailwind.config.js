/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#f2c811', // Power BI main yellow
          600: '#e6ad10', // Power BI darker yellow
          700: '#ca8a04',
          800: '#a16207',
          900: '#854d0e',
        }
      }
    },
  },
  plugins: [],
}
