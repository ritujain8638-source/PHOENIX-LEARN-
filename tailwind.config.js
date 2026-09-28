/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        phoenix: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        ember: {
          DEFAULT: '#ff4d00',
          light: '#ff7433',
          dark: '#cc3d00',
          glow: '#ff6600',
        },
        void: {
          DEFAULT: '#0a0a0f',
          card: '#111118',
          border: '#1e1e2e',
          muted: '#16161f',
        },
        neon: {
          orange: '#ff6b35',
          amber: '#ffb347',
          red: '#ff2d55',
          purple: '#bf5af2',
          blue: '#0a84ff',
          green: '#30d158',
          yellow: '#ffd60a',
          cyan: '#32ade6',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.1)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'phoenix-gradient': 'linear-gradient(135deg, #ff4d00 0%, #ff9500 50%, #ffcc00 100%)',
        'dark-radial': 'radial-gradient(ellipse at top, #1a0a00 0%, #0a0a0f 60%)',
        'ember-glow': 'radial-gradient(circle at center, rgba(255,77,0,0.15) 0%, transparent 70%)',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,107,53,0.08)' stroke-width='1'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fire': 'fire 1.5s ease-in-out infinite alternate',
        'rotate-slow': 'rotate 20s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'neon-flicker': 'neonFlicker 3s ease-in-out infinite',
        'streak-burn': 'streakBurn 1s ease-out forwards',
        'particle-rise': 'particleRise 2s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,53,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(255,107,53,0.8), 0 0 100px rgba(255,107,53,0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fire: {
          '0%': { filter: 'hue-rotate(0deg) brightness(1)' },
          '100%': { filter: 'hue-rotate(15deg) brightness(1.2)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        neonFlicker: {
          '0%, 100%': { textShadow: '0 0 10px #ff6b35, 0 0 20px #ff6b35, 0 0 40px #ff6b35' },
          '50%': { textShadow: '0 0 5px #ff6b35, 0 0 10px #ff6b35' },
          '75%': { textShadow: '0 0 20px #ff6b35, 0 0 40px #ff6b35, 0 0 80px #ff6b35' },
        },
        streakBurn: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        particleRise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(0)', opacity: '0' },
        },
      },
      boxShadow: {
        'neon-orange': '0 0 20px rgba(255,107,53,0.5), 0 0 40px rgba(255,107,53,0.3)',
        'neon-amber': '0 0 20px rgba(255,179,71,0.5), 0 0 40px rgba(255,179,71,0.3)',
        'neon-red': '0 0 20px rgba(255,45,85,0.5), 0 0 40px rgba(255,45,85,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.1)',
        'inner-glow': 'inset 0 0 30px rgba(255,107,53,0.1)',
        'phoenix': '0 0 60px rgba(255,77,0,0.4), 0 0 120px rgba(255,153,0,0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
