/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0f1e",
          900: "#12172b",
          700: "#1f2945"
        },
        oasis: {
          500: "#1cc8a0",
          600: "#18b28f"
        },
        solar: {
          500: "#f5b43a",
          600: "#e6a52f"
        }
      },
      boxShadow: {
        glow: "0 0 30px rgba(28, 200, 160, 0.25)"
      }
    }
  },
  plugins: []
};
