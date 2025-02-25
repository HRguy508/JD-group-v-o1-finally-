/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#FFFFFF',
          text: '#1A1A1A',
          cta: '#FF5722',
        },
        secondary: {
          bg: '#F5F5F5',
          accent: '#3DA1FF',
          corporate: '#1E3A5F',
        },
        highlight: '#FFC107',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-sm': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'heading-lg': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'heading': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'heading-sm': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'body': ['1rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        tighter: '-0.025em',
        tight: '-0.01em',
      },
    },
  },
  plugins: [],
};