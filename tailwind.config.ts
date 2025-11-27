import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'Helvetica', 'Arial', 'sans-serif'],
        archivo: ['var(--font-archivo)', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-azeret-mono)', 'Courier New', 'monospace'],
      },
      fontSize: {
        'h1': ['54px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['46px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['34px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'h5': ['19px', { lineHeight: '1.4', fontWeight: '600' }],
        'h6': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
        'p1': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'p2': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'p3': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
      },
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#5FE074", // Cor principal verde
          500: "#5FE074",
          600: "#4ade80",
          700: "#22c55e",
          800: "#16a34a",
          900: "#15803d",
        },
        dark: {
          DEFAULT: "#031C30", // Cor principal escura
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#031C30",
        },
      },
    },
  },
  plugins: [],
};
export default config;

