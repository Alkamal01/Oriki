/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Oríkì Brand Colors - Matching Logo
        'oriki-beige': '#F5F0E8',      // Light background
        'oriki-brown': '#B8860B',      // Primary gold/brown from logo
        'oriki-blue': '#6B8E9E',       // Blue-gray from circuit patterns
        'oriki-gold': '#DAA520',       // Bright gold accent
        'oriki-charcoal': '#2D2D2D',   // Dark text/backgrounds
        'oriki-copper': '#CD853F',     // Copper/bronze accent
      },
    },
  },
  plugins: [],
}
