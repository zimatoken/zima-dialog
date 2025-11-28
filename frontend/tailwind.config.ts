import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zima-ice': '#88A9C3',
        'zima-deep': '#284257',
        'zima-night': '#14202E',
        'zima-abyss': '#091235',
        'crystal-glow': '#D0D2DE',
        'snow-white': '#EAE7E2'
      },
      borderRadius: {
        lg: '12px',
        xl: '16px'
      }
    },
  },
  plugins: [],
} satisfies Config

