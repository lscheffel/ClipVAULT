import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f9f7",
          100: "#d8eee5",
          500: "#1d8469",
          700: "#145745",
          900: "#0c3429"
        }
      },
      boxShadow: {
        panel: "0 10px 30px rgba(12, 52, 41, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;
