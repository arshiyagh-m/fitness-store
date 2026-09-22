/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FBBF24', // زرد/طلایی ورزشی
          hover: '#F59E0B',
          light: '#FEF3C7',
          dark: '#B45309'
        },
        dark: {
          DEFAULT: '#111827', // مشکی تیره
          light: '#374151'
        },
        gray: {
          50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB',
          400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151',
          800: '#1F2937', 900: '#111827',
        }
      }
    },
  },
  plugins: [],
}
