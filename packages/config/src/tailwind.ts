import type { Config } from "tailwindcss";

export const tailwindConfig: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        surface: {
          base: "hsl(var(--surface-base))",
          raised: "hsl(var(--surface-raised))",
          strong: "hsl(var(--surface-strong))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
          inverse: "hsl(var(--text-inverse))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Open Sans", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "20px" }],
        md: ["13.5px", { lineHeight: "22px" }],
        lg: ["14px", { lineHeight: "22px" }],
        xl: ["14.25px", { lineHeight: "24px" }],
        "2xl": ["15px", { lineHeight: "24px" }],
        "3xl": ["15.68px", { lineHeight: "26px" }],
        "4xl": ["18px", { lineHeight: "28px" }],
      },
      spacing: {
        "px": "1px",
        "0.5": "2px",
        "1": "5px",
        "2": "6px",
        "3": "10px",
        "4": "14px",
        "5": "15px",
        "6": "20px",
        "7": "40px",
        "8": "55px",
      },
      borderRadius: {
        xs: "5px",
        sm: "35px",
        md: "50px",
        lg: "calc(var(--radius) - 2px)",
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        DEFAULT: "rgba(0, 0, 0, 0.17) 0px 0px 5px 0px",
      },
      transitionDuration: {
        instant: "250ms",
      },
    },
  },
};
