/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: '#0a0a0a',
        surface: '#141414',
        muted: '#1a1a1a',
        accent: '#e8dcc8',
        dim: '#666666',
      },
    },
  },
  plugins: [],
};
