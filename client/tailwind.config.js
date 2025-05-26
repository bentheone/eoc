/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#006400', // Dark green
        'white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
