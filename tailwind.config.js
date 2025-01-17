/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0 1px 2px rgba(0, 0, 0, 0.25)", // Define your custom shadow here
      },
    },
  },
  plugins: [],
};
