export const designTokens = {
  colors: {
    text: {
      primary: "#333333",
      secondary: "#242424",
      tertiary: "#ffffff",
      inverse: "#3e3e3e",
    },
    surface: {
      base: "#000000",
      raised: "#f3f3f3",
      strong: "#e1ebff",
    },
    border: {
      DEFAULT: "#e5e7eb",
      muted: "#f3f4f6",
    },
    destructive: {
      DEFAULT: "#ef4444",
      foreground: "#ffffff",
    },
  },
  typography: {
    fontFamily: {
      primary: "Open Sans, sans-serif",
    },
    fontSize: {
      xs: "12px",
      sm: "13px",
      md: "13.5px",
      lg: "14px",
      xl: "14.25px",
      "2xl": "15px",
      "3xl": "15.68px",
      "4xl": "18px",
    },
    fontWeight: {
      base: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      base: "24px",
      tight: "20px",
      snug: "22px",
    },
  },
  spacing: {
    1: "5px",
    2: "6px",
    3: "10px",
    4: "14px",
    5: "15px",
    6: "20px",
    7: "40px",
    8: "55px",
  },
  radius: {
    xs: "5px",
    sm: "35px",
    md: "50px",
  },
  shadow: {
    DEFAULT: "rgba(0, 0, 0, 0.17) 0px 0px 5px 0px",
  },
  motion: {
    duration: {
      instant: "250ms",
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
