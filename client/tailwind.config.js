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
        // تغییر رنگ اصلی به زرد/طلایی ورزشی
        primary: {
          DEFAULT: '#FBBF24', // Amber 400 (زرد ورزشی)
          hover: '#F59E0B',   // Amber 500
          light: '#FEF3C7',   // Amber 100
          dark: '#B45309'     // Amber 700
        },
        dark: {
          DEFAULT: '#111827', // Gray 900
          light: '#374151'    // Gray 700
        },
        // خاکستری‌ها برای پس‌زمینه و متن
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
