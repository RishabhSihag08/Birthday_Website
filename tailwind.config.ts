import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rosecream: "#FFF5F7",
        blush: {
          50: "#FFF5F7",
          100: "#FFE4E9",
          200: "#FECDD6",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
          800: "#9F1239",
          900: "#881337",
          950: "#4C0519",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "elegant": "cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce-soft": "cubic-bezier(0.68, -0.25, 0.265, 1.25)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
      },
      animation: {
        // Fluid floating motion with natural easing
        "float-slow": "float 10s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "float-gentle": "floatGentle 8s cubic-bezier(0.16, 1, 0.3, 1) infinite",

        // Smooth pulsing effects
        "pulse-subtle": "pulseSubtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulseGlow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite",

        // Sophisticated shimmer and shine
        "shimmer": "shimmer 3s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "shine": "shine 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite",

        // Fade and scale entrance animations
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-down": "fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",

        // Rotation animations
        "spin-slow": "spin 8s linear infinite",
        "spin-smooth": "spin 3s cubic-bezier(0.4, 0, 0.2, 1) infinite",

        // Bounce animations
        "bounce-soft": "bounceSoft 1s cubic-bezier(0.68, -0.25, 0.265, 1.25)",
        "bounce-gentle": "bounceGentle 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",

        // Liquid glass animations
        "liquid-flow": "liquidFlow 8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "liquid-shine": "liquidShine 3s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "holo-shift": "holoShift 6s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "glass-morph": "glassMorph 4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
      keyframes: {
        // Floating animations
        float: {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
            opacity: "1",
          },
          "50%": {
            transform: "translateY(-16px) rotate(2deg)",
            opacity: "0.95",
          },
        },
        floatGentle: {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px) rotate(0deg)",
          },
          "33%": {
            transform: "translateY(-10px) translateX(5px) rotate(1deg)",
          },
          "66%": {
            transform: "translateY(-5px) translateX(-5px) rotate(-1deg)",
          },
        },

        // Pulse animations
        pulseSubtle: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.9",
            transform: "scale(1.02)",
          },
        },
        pulseGlow: {
          "0%, 100%": {
            opacity: "0.8",
            filter: "brightness(1) drop-shadow(0 0 8px rgba(251, 113, 133, 0.4))",
          },
          "50%": {
            opacity: "1",
            filter: "brightness(1.1) drop-shadow(0 0 16px rgba(251, 113, 133, 0.6))",
          },
        },

        // Shimmer effects
        shimmer: {
          "0%": {
            backgroundPosition: "-200% center",
            opacity: "0.7",
          },
          "50%": {
            opacity: "1",
          },
          "100%": {
            backgroundPosition: "200% center",
            opacity: "0.7",
          },
        },
        shine: {
          "0%": {
            transform: "translateX(-100%) skewX(-15deg)",
            opacity: "0",
          },
          "50%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateX(200%) skewX(-15deg)",
            opacity: "0",
          },
        },

        // Fade animations
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },

        // Bounce animations
        bounceSoft: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        bounceGentle: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "25%": {
            transform: "translateY(-8px)",
          },
          "50%": {
            transform: "translateY(0px)",
          },
          "75%": {
            transform: "translateY(-4px)",
          },
        },

        // Liquid glass animations
        liquidFlow: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        liquidShine: {
          "0%": {
            left: "-100%",
          },
          "50%, 100%": {
            left: "100%",
          },
        },
        holoShift: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            filter: "hue-rotate(0deg)",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            filter: "hue-rotate(5deg)",
          },
        },
        glassMorph: {
          "0%, 100%": {
            backdropFilter: "blur(20px) saturate(180%)",
            transform: "scale(1)",
          },
          "50%": {
            backdropFilter: "blur(24px) saturate(200%)",
            transform: "scale(1.01)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
