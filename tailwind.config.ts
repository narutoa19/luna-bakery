import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#faf7f2",
          100: "#f5f0e8",
          200: "#ede0d0",
        },
        wood: {
          DEFAULT: "#4a3728",
          light: "#8b7355",
        },
        gold: {
          DEFAULT: "#c4a882",
          dark: "#a88860",
          light: "#e8d5b0",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Noto Serif SC", "serif"],
        sans: ["PingFang SC", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
