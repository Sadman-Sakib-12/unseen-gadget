export const designTokens = {
  colors: {
    primary: {
      DEFAULT: "#1C2B6D",
      50: "#eef1f8",
      100: "#d5daf0",
      200: "#aeb7e1",
      300: "#8694d2",
      400: "#5f71c3",
      500: "#3d4fa8",
      600: "#1C2B6D",
      700: "#182459",
      800: "#141c47",
      900: "#0e1535",
    },
    success: {
      DEFAULT: "#10b981",
      50: "#ecfdf5",
      100: "#d1fae5",
      600: "#059669",
      700: "#047857",
    },
    error: {
      DEFAULT: "#ef4444",
      50: "#fef2f2",
      100: "#fee2e2",
      600: "#dc2626",
      700: "#b91c1c",
    },
    warning: {
      DEFAULT: "#f59e0b",
      50: "#fffbeb",
      100: "#fef3c7",
      600: "#d97706",
      700: "#b45309",
    },
  },
  typography: {
    fontFamily: {
      primary: "Open Sans, sans-serif",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    fontWeight: {
      base: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: "1.25",
      snug: "1.4",
      base: "1.5",
      relaxed: "1.625",
    },
  },
  radius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.25rem",
  },
  shadow: {
    sm: "0 1px 2px 0 rgb(15 23 42 / 0.06)",
    DEFAULT: "0 1px 3px 0 rgb(15 23 42 / 0.10), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
    md: "0 4px 6px -1px rgb(15 23 42 / 0.07), 0 2px 4px -2px rgb(15 23 42 / 0.06)",
  },
  motion: {
    duration: {
      fast: "150ms",
      instant: "200ms",
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
