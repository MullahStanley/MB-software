/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system exact CSS variables
        'bg-primary': 'var(--bg-primary)',
        'bg-card-white': 'var(--bg-card-white)',
        'bg-card-sage': 'var(--bg-card-sage)',
        'bg-banner-dark': 'var(--bg-banner-dark)',
        'text-primary': 'var(--text-primary)',
        'text-body': 'var(--text-body)',
        'text-eyebrow': 'var(--text-eyebrow)',
        'text-on-dark': 'var(--text-on-dark)',
        'text-accent-gold': 'var(--text-accent-gold)',
        'accent-primary': 'var(--accent-primary)',
        'border-strong': 'var(--border-strong)',
        'border-subtle': 'var(--border-subtle)',

        // Earthy palette tokens
        earth: {
          50: '#FAF8F4',
          100: '#F4F1EA', // Warm cream canvas
          200: '#EAE6DC',
          300: '#D8D4C9', // Soft warm divider
          400: '#B9D2B9', // Soft sage feature pills
          500: '#5F996F',
          600: '#2E6F40', // Leaf green for primary buttons/icons & medium green eyebrow
          700: '#245934',
          800: '#1B4326', // Deep forest green headings / banner / strong border
          900: '#13321C',
          950: '#0C2012',
          charcoal: '#2B2E2B', // Charcoal body copy
          gold: '#C8B87E',     // Muted gold eyebrow on dark surfaces
        },

        // Backward compatibility mappings so existing components blend seamlessly
        beacon: {
          50: '#FAF8F4',
          100: '#F4F1EA',
          200: '#E2EBDD',
          300: '#B9D2B9',
          400: '#6FA47E',
          500: '#2E6F40',
          600: '#235934',
          700: '#1B4326',
          800: '#14351E',
          900: '#0E2415',
          950: '#08170D',
        },
        slatebg: {
          850: '#1F2A21',
          900: '#1B4326',
          950: '#14331D',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'breathe-in-out': 'breathe 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.28)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
