/** @type {import('tailwindcss').Config} */
// import colors from 'tailwindcss/defaultTheme';
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [
    typography
  ],
};
