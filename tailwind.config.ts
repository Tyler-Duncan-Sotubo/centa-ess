import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        md: "1rem", // Adjust as needed (17px here)
      },
      colors: {
        "custom-blue": "#226DB4",
        sidebar: "#F7F7FE",
        brand: "#441fc0",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        textPrimary: "#111827",
        textSecondary: "#6B7280",
        textDisabled: "#9CA3AF",
        textInverse: "#FFFFFF",
        background: "#E5E7EB",
        divider: "#E5E7EB",
        border: "#D1D5DB",
        buttonPrimary: "#3B5BCC",
        buttonPrimaryHover: "#4D70F9 ",
        buttonSecondary: "#E5E7EB",
        buttonSecondaryHover: "#D1D5DB",

        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    keyframes: {
      wave: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-10px)" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "ball-1": "wave 1s ease-in-out infinite",
      "ball-2": "wave 1s ease-in-out infinite 0.15s",
      "ball-3": "wave 1s ease-in-out infinite 0.3s",
      "ball-4": "wave 1s ease-in-out infinite 0.45s",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};
export default config;
