/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mist: '#f8fafc',
        line: '#dbe4f0',
        brand: {
          50: '#eff9ff',
          100: '#daf1ff',
          200: '#bde7ff',
          300: '#8ed8ff',
          400: '#59c2ff',
          500: '#26a8f5',
          600: '#0f85d1',
          700: '#116aa8',
          800: '#155889',
          900: '#184a71'
        },
        accent: {
          50: '#fff5ea',
          100: '#ffe8c9',
          200: '#ffd28f',
          300: '#ffb657',
          400: '#ff9930',
          500: '#f67615',
          600: '#d8560f',
          700: '#b34110',
          800: '#913513',
          900: '#762d13'
        }
      },
      boxShadow: {
        glow: '0 20px 60px rgba(15, 133, 209, 0.18)',
        soft: '0 20px 45px rgba(15, 23, 42, 0.08)'
      },
      fontFamily: {
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.16) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};
