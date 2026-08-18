import type { Config } from "tailwindcss";
import { designTokens } from "@unseen-gadget/ui";

export const tailwindConfig: Partial<Config> = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ...designTokens.colors,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          ...designTokens.colors.primary,
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
        bengali: ["var(--font-bengali)", "var(--font-sans)", "sans-serif"],
      },
      fontSize: {
        ...designTokens.typography.fontSize,
      },
      fontWeight: Object.fromEntries(
        Object.entries(designTokens.typography.fontWeight).map(([k, v]) => [k, String(v)])
      ),
      lineHeight: {
        ...designTokens.typography.lineHeight,
      },
      borderRadius: {
        xs: designTokens.radius.xs,
        sm: designTokens.radius.sm,
        md: designTokens.radius.md,
        lg: designTokens.radius.lg,
        xl: designTokens.radius.xl,
        "2xl": designTokens.radius["2xl"],
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        sm: designTokens.shadow.sm,
        DEFAULT: designTokens.shadow.DEFAULT,
        md: designTokens.shadow.md,
      },
      transitionDuration: {
        fast: designTokens.motion.duration.fast,
        instant: designTokens.motion.duration.instant,
      },
    },
  },
};
