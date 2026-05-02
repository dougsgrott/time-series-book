/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)',
        'muted-2': 'var(--muted-2)',
        rule: 'var(--rule)',
        'rule-strong': 'var(--rule-strong)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        tint: 'var(--tint)',
        'tint-2': 'var(--tint-2)',
      },
      fontFamily: {
        serif: ['var(--serif)'],
        sans: ['var(--sans)'],
        mono: ['var(--mono)'],
      },
    },
  },
  plugins: [],
};
