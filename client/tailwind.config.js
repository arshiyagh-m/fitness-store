// filepath: client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // تنظیم فونت پیش‌فرض به وزیرمتن
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        // پالت رنگی الهام گرفته از دیجی‌کالا با حس انرژی و ورزش
        primary: {
          DEFAULT: '#ef4056', // قرمز دیجی‌کالایی
          hover: '#d33346',
          light: '#fdeced'
        },
        dark: {
          DEFAULT: '#242424',
          light: '#3f3f3f'
        },
        gray: {
          50: '#f8f8f8',
          100: '#f0f0f1',
          200: '#e0e0e2',
          300: '#c0c0c4',
          400: '#a1a3a8',
          500: '#81858b', // خاکستری متون دیجی‌کالا
          600: '#62666d',
          700: '#424750', // خاکستری تیره تیترها
          800: '#232933',
          900: '#0c0c0c',
        }
      }
    },
  },
  plugins: [],
}