import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#f7f3ea",
        wheat: "#d8b36a",
        cinnabar: "#9f2f24",
        graphite: "#30343b"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 28, 23, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

