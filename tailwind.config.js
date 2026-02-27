/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#f4c025',
        'gold-primary': '#D4AF37',
        'gold-light': '#F1E5AC',
        'background-light': '#f8f8f5',
        'background-dark': '#121008',
        'dark-bg': '#121212',
        'dark-surface': '#1E1E1E',
        'dark-border': '#333333',
        'surface-dark': '#221e10'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      }
    }
  },
  plugins: []
};
