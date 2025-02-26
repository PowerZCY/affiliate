import type { Config } from "tailwindcss"

export const lightVariables = {
  colors: {
    border: "#dfe1e5",
    input: "#f4f4f4",
    ring: "#167dff",
    background: "#ffffff",
    foreground: "#27282c",
    primary: "#167dff",
    "primary-foreground": "#ffffff",
    secondary: "#f7f8fa",
    "secondary-foreground": "#27282c",
    destructive: "#ff3633",
    "destructive-foreground": "#ffffff",
    success: "#3eaf7c",
    "success-foreground": "#ffffff",
    muted: "#f7f8fa",
    "muted-foreground": "#6c737c",
    accent: "#f7f8fa",
    "accent-foreground": "#27282c",
    popover: "#ffffff",
    "popover-foreground": "#27282c",
    card: "#ffffff",
    "card-foreground": "#27282c",
  },
};

export const darkVariables = {
  colors: {
    border: "#2b2d30",
    input: "#2b2d30",
    ring: "#3592ff",
    background: "#1e1f22",
    foreground: "#dfe1e5",
    primary: "#3592ff",
    "primary-foreground": "#ffffff",
    secondary: "#2b2d30",
    "secondary-foreground": "#dfe1e5",
    destructive: "#ff5647",
    "destructive-foreground": "#ffffff",
    success: "#3eaf7c",
    "success-foreground": "#ffffff",
    muted: "#2b2d30",
    "muted-foreground": "#9da0a5",
    accent: "#2b2d30",
    "accent-foreground": "#dfe1e5",
    popover: "#1e1f22",
    "popover-foreground": "#dfe1e5",
    card: "#1e1f22",
    "card-foreground": "#dfe1e5",
  },
};

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    variables: {
      DEFAULT: lightVariables,
    },
    darkVariables: {
      DEFAULT: darkVariables,
    },
  },
  plugins: [require("tailwindcss-animate"),require('@tailwindcss/typography')],
} satisfies Config

export default config