import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "[-20]": "20px",
        "[-18]": "18px",
        "[-14]": "14px",
        "[-16]": "16px",
        "[-10]": "10px",
        "[-12]": "12px",
      },
      backgroundColor: {
        primary: "#1668e3",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1668e3",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      flex: {
        1: "1 1 0%", // flex-grow: 1, flex-shrink: 1, flex-basis: 0%
        2: "2 2 0%", // flex-grow: 2, flex-shrink: 2, flex-basis: 0%
        3: "3 3 0%", // flex-grow: 3, flex-shrink: 3, flex-basis: 0%
        4: "4 4 0%", // flex-grow: 4, flex-shrink: 4, flex-basis: 0%
        5: "5 5 0%", // flex-grow: 5, flex-shrink: 5, flex-basis: 0%
        6: "6 6 0%", // flex-grow: 6, flex-shrink: 6, flex-basis: 0%
        7: "7 7 0%", // flex-grow: 7, flex-shrink: 7, flex-basis: 0%
        8: "8 8 0%", // flex-grow: 8, flex-shrink: 8, flex-basis: 0%
        9: "9 9 0%", // flex-grow: 9, flex-shrink: 9, flex-basis: 0%
        10: "10 10 0%", // flex-grow: 10, flex-shrink: 10, flex-basis: 0%
      },
      width: {
        "[-375]": "375px",
      },
      borderRadius: {
        "[-50]": "50%",
      },
    },
  },
  plugins: [],
};
export default config;
