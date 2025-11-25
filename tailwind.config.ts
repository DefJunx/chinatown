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
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "slide-out": "slideOut 0.3s ease-in",
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-out": "fadeOut 0.3s ease-in",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-in": "bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "pulse-once": "pulseOnce 0.6s ease-in-out",
        "success-bounce": "successBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "cart-badge-bounce": "cartBadgeBounce 0.5s ease-out",
        "wiggle": "wiggle 0.5s ease-in-out",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        pulseOnce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        successBounce: {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(0.9)" },
          "50%": { transform: "scale(1.1)" },
          "75%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        cartBadgeBounce: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
