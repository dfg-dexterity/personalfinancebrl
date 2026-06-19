/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // surfaces
        body: '#e7e5dd',
        canvas: '#f7f6f2',
        paper: '#ffffff',
        line: '#ecebe3',
        'line-soft': '#f0eee6',
        'line-faint': '#f5f3ec',
        // ink / text
        ink: '#26241e',
        'ink-2': '#3a3833',
        'ink-3': '#6b6759',
        muted: '#8a8678',
        faint: '#a8a499',
        // brand greens ("Sereno")
        forest: {
          DEFAULT: '#1f3d2b',
          900: '#1c3525',
          800: '#1f3d2b',
          700: '#274d36',
          600: '#3f7a55',
          500: '#6aa57f',
        },
        mint: '#9ee6b5',
        // text on dark green surfaces
        'on-dark': '#eef3ee',
        'on-dark-soft': '#a9c3b0',
        // sidebar
        'side-text': '#cfe0d3',
        'side-item': '#a7c2b1',
        'side-muted': '#8fb29b',
        // accents
        warn: '#c98a3f',
        'warn-2': '#b07b2e',
        danger: '#c2603a',
        sand: '#d9bba6',
        track: '#e6e3d8',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        fadeUp: 'fadeUp .2s ease',
        spin: 'spin .7s linear infinite',
      },
    },
  },
  plugins: [],
}
