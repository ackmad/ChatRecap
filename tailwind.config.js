/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        pastel: {
          bgStart: '#FFFDFB',
          bgEnd: '#F4F1FF',
          card: '#FFE5D9',
          primary: '#B8A9E6',
          primaryHover: '#A595E5',
          secondary: '#E9F7EF',
          secondaryText: '#4A6F63',
          lavender: '#E6D9FF',
          peach: '#FFE5D9',
          mint: '#E9F7EF',
          gray: '#F4F4F4',
          blue: '#E3F2FD',
          yellow: '#FFF9C4',
          darkCard: '#292524',
          darkBgStart: '#1c1917',
          darkBgEnd: '#0c0a09',
        },
        txt: {
          main: '#6B6B6B',
          sub: '#9A9A9A',
          quote: '#7A6FAE',
        },
        emo: {
          warm: '#FFD6A5',
          enthusiastic: '#FFCAD4',
          neutral: '#E0E0E0',
          sad: '#CDB4DB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Nunito', 'sans-serif'],
      },
      backgroundImage: {
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')",
      },
    }
  },
  plugins: [],
}
