/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Black Ops One"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        'bg-primary':   'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-card':      'var(--bg-card)',
        'bg-input':     'var(--bg-input)',
        'bg-btn':       'var(--bg-btn)',
        'text-main':    'var(--text-primary)',
        'text-sub':     'var(--text-secondary)',
        'text-muted':   'var(--text-muted)',
        'border-main':  'var(--border)',
        'border-strong':'var(--border-strong)',
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
      },
    },
  },
  plugins: [],
};
