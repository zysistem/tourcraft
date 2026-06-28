import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      colors: {
        navy: { DEFAULT: '#1B2A4A', 2: '#243a63', soft: '#eef1f7' },
        ink: '#1a1d24',
        muted: '#6b7280',
        faint: '#9aa1ad',
        line: '#e6e8ec',
        bg: '#f5f6f8',
        card: '#ffffff',
        gold: { DEFAULT: '#b08147', soft: '#f3ece1' },
        green: { DEFAULT: '#2f9e6e', soft: '#e7f5ee' },
        red: { DEFAULT: '#cf5a4e', soft: '#fbece9' },
        amber: { DEFAULT: '#d99a2b', soft: '#fbf2dd' },
      },
    },
  },
  plugins: [],
};
export default config;
