/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#1a1f2e',
        'game-board': '#0f1419',
        'snake-head': '#22c55e',
        'snake-body': '#16a34a',
        'food': '#ef4444',
        'power-up': '#f59e0b',
      },
      animation: {
        'pulse-food': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.8)',
          },
        },
      },
    },
  },
  plugins: [],
}