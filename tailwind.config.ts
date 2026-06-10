import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ft: {
          purple: "#352F63",
          green: "#8BCDA1",
          coral: "#E9847E",
          yellow: "#FCBC12",
          navy: "#343F49",
          "mid-purple": "#6464AF",
          light: "#F3F3F3",
          orange: "#F7911E",
        },
      },
      fontFamily: {
        display: ["Bebas Neue", "system-ui", "sans-serif"],
        body: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
