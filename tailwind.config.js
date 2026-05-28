/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          950: "#08080c",
          900: "#0c0c12",
          800: "#14141d",
          700: "#1c1c28",
          600: "#262635",
          500: "#3a3a4d",
          400: "#5b5b76",
          300: "#8b8ba8",
          200: "#bdbdd2",
          100: "#e5e5f0",
        },
        accent: {
          violet: "#8b5cf6",
          cyan: "#22d3ee",
          fuchsia: "#e879f9",
          lime: "#a3e635",
        },
        party: {
          dp: "#152484",
          ppp: "#E61E2B",
          jp: "#FFCC00",
          rp: "#00B6B0",
          npp: "#F58400",
          ind: "#8b8ba8",
        },
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(139,92,246,0.15), transparent 60%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,92,246,0.4), 0 8px 30px rgba(139,92,246,0.15)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 40px rgba(0,0,0,0.35)",
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "shimmer": "shimmer 2.4s linear infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
