import type { Config } from "tailwindcss";
import { tailwindConfig } from "@unseen-gadget/config";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  ...tailwindConfig,
  theme: {
    ...tailwindConfig.theme,
    extend: {
      ...tailwindConfig.theme?.extend,
      spacing: {},
      fontSize: {},
      borderRadius: {},
      boxShadow: {},
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
};

export default config;