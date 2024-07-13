/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        loading: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        loading: 'loading 1.2s linear infinite',
      },
    },
  },
  plugins: [],
}

