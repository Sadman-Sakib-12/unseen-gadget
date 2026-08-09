import type { Config } from "tailwindcss";
import { tailwindConfig } from "@unseen-gadget/config";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  ...tailwindConfig,
};

export default config;
