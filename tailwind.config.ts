import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'solmate-green': '#00C896',
        'solmate-black': '#000000',
        'solmate-white': '#FFFFFF',
        'solmate-dark-card': '#111111',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            'box-shadow': '0 0 20px 0px rgba(0, 200, 150, 0.3)',
          },
          '50%': {
            'box-shadow': '0 0 40px 0px rgba(0, 200, 150, 0.5)',
          },
        },
        'flywheel-spin': {
          'from': {
            'transform': 'rotate(0deg)',
          },
          'to': {
            'transform': 'rotate(360deg)',
          },
        },
        'ping-ring': {
          '0%': {
            'transform': 'scale(1)',
            'opacity': '0.6',
          },
          '100%': {
            'transform': 'scale(1.9)',
            'opacity': '0',
          },
        },
        'dash-flow': {
          '0%': {
            'stroke-dashoffset': '0',
          },
          '100%': {
            'stroke-dashoffset': '-25',
          },
        },
        'chip-in': {
          '0%': {
            'opacity': '0',
            'transform': 'translate(-50%, -50%) scale(0.5)',
          },
          '100%': {
            'opacity': '1',
            'transform': 'translate(-50%, -50%) scale(1)',
          },
        },
        'heartbeat': {
          '0%': {
            'transform': 'scale(1)',
          },
          '15%': {
            'transform': 'scale(1.15)',
          },
          '30%': {
            'transform': 'scale(1)',
          },
          '45%': {
            'transform': 'scale(1.15)',
          },
          '70%': {
            'transform': 'scale(1)',
          },
          '100%': {
            'transform': 'scale(1)',
          },
        },
        'pump-flow': {
          '0%': {
            'stroke-dashoffset': '0',
          },
          '100%': {
            'stroke-dashoffset': '-20.2',
          },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'flywheel-spin': 'flywheel-spin 8s linear infinite',
        'ping-ring': 'ping-ring 2.4s ease-out infinite',
        'dash-flow': 'dash-flow 1.6s linear infinite',
        'chip-in': 'chip-in 0.5s ease-out both',
        'heartbeat': 'heartbeat 1.1s ease-in-out infinite',
        'pump-flow': 'pump-flow 1.1s linear infinite',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle, rgba(0, 200, 150, 0.15) 0%, rgba(0, 200, 150, 0) 70%)',
        'radial-glow-strong': 'radial-gradient(circle, rgba(0, 200, 150, 0.25) 0%, rgba(0, 200, 150, 0) 70%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
