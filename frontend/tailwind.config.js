/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0D0F2B', 2: '#181C45', 3: '#272E63' },
        paper: { DEFAULT: '#FFFFFF', 2: '#F5F6FD' },
        coral: { DEFAULT: '#FF5A3C', dim: '#FFE3DA' },
        teal: { DEFAULT: '#00D3A0', dim: '#D9F9EE' },
        violet: { DEFAULT: '#8C5CFF', dim: '#EEE8FF' },
        subtext: '#5B6178',
        faint: '#9198B0',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
