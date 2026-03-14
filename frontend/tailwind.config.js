/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': '#5B4EFF',
        'accent-green': '#7ED957',
        'habit-yellow': '#F5C842',
        'habit-pink': '#F56FAD',
        'habit-white': '#FFFFFF',
        'text-dark': '#1A1A1A',
        'text-muted': '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
