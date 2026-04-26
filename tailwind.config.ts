/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            50:  "#fff2ef",
            100: "#ffe0d8",
            200: "#ffc0b2",
            300: "#ff9a85",
            400: "#ff7a62",
            500: "#FF6039",
            600: "#e84e28",
            700: "#cc3d1a",
            800: "#a83010",
            900: "#82230a",
          },
        },
      },
    },
    plugins: [],
  }