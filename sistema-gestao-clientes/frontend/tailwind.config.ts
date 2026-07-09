import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        app: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          'bg-soft': 'rgb(var(--color-bg-soft) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          'surface-strong': 'rgb(var(--color-surface-strong) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',
          text: 'rgb(var(--color-text) / <alpha-value>)',
          muted: 'rgb(var(--color-muted) / <alpha-value>)',
        },
        electric: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
        },
        neon: {
          cyan: '#22D3EE',
          green: '#34D399',
          red: '#FB7185',
          amber: '#FBBF24',
        },
      },
      boxShadow: {
        glow: '0 0 36px rgba(59, 130, 246, 0.25)',
        'glow-cyan': '0 0 32px rgba(34, 211, 238, 0.2)',
        panel: '0 24px 80px rgba(2, 8, 23, 0.35)',
      },
      backdropBlur: {
        glass: '18px',
      },
      borderRadius: {
        '2.5xl': '1.35rem',
      },
      backgroundImage: {
        'premium-radial':
          'radial-gradient(circle at top left, rgba(59, 130, 246, .28), transparent 34%), radial-gradient(circle at 80% 0%, rgba(34, 211, 238, .18), transparent 30%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(59,130,246,.28), rgba(34,211,238,.08))',
      },
    },
  },
  plugins: [],
};

export default config;
