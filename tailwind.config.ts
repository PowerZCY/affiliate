import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export const lightVariables = {
  colors: {
    border: "#dfe1e5",
    input: "#f4f4f4",
    ring: "#167dff",
    background: "#ffffff",
    foreground: "#1a1f36",     // 加深文本颜色
    primary: "#167dff",
    "primary-foreground": "#ffffff",
    "primary-dark": "#0e5cb8",  // 添加深色主色调
    secondary: "#f7f8fa",
    "secondary-foreground": "#27282c",
    destructive: "#ff3633",
    "destructive-foreground": "#ffffff",
    success: "#3eaf7c",
    "success-foreground": "#ffffff",
    muted: "#f7f8fa",
    "muted-foreground": "#424867", // 加深次要文本
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
    foreground: "#e8eaed",     // 提高亮度
    primary: "#3592ff",
    "primary-foreground": "#ffffff",
    "primary-dark": "#2a74cc",  // 添加深色主色调
    secondary: "#2b2d30",
    "secondary-foreground": "#dfe1e5",
    destructive: "#ff5647",
    "destructive-foreground": "#ffffff",
    success: "#3eaf7c",
    "success-foreground": "#ffffff",
    muted: "#2b2d30",
    "muted-foreground": "#9ba1b0", // 提高对比度
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
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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
          dark: "hsl(var(--primary-dark))",
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
        nav: {
          DEFAULT: "hsl(var(--nav-background))",
          foreground: "hsl(var(--nav-foreground))",
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
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
    variables: {
      DEFAULT: lightVariables,
    },
    darkVariables: {
      DEFAULT: darkVariables,
    },
  },
  plugins: [animate, typography],
} satisfies Config

export default config