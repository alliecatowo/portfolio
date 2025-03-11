/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'primary': '#FF69B4', // Pink
        'primary-light': '#FFB6C1', // Light pink
        'primary-dark': '#C71585', // Dark pink
        'accent': '#ADD8E6', // Baby blue
        'accent-light': '#E0FFFF', // Light baby blue
        'accent-dark': '#87CEEB', // Dark baby blue
        'background': '#FFFFFF', // White
        'text': '#333333', // Dark gray
        
        // Dark mode colors
        'dark-primary': '#FF1493', // Bright pink
        'dark-primary-light': '#FF69B4', // Light pink
        'dark-primary-dark': '#8B008B', // Dark pink
        'dark-background': '#121212', // Black
        'dark-text': '#F5F5F5', // White
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} 