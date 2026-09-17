import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          base: "#0B0F19", // Midnight Slate dark
          light: "#F8FAFF", // Airy slate-indigo light
          cardLight: "#FFFFFF",
          cardDark: "#151C2C",
          borderLight: "#E9F1FF",
          borderDark: "#1E293B",
          surface: "rgba(21, 28, 44, 0.75)",
          elevated: "rgba(30, 41, 59, 0.75)",
        },
        brand: {
          primary: "#756EF3", // TaskPulse Signature Indigo
          primaryLight: "#F0EFFF",
          primaryDark: "#5B52E0",
          navy: "#002055",
          blue: "#756EF3",
          emerald: "#10B981",
        },
        capacity: {
          optimal: "#10B981",
          warning: "#F59E0B",
          overload: "#EF4444",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-elevated": "0 12px 40px 0 rgba(0, 0, 0, 0.50)",
      },
      backdropBlur: {
        glass: "24px",
        "glass-heavy": "28px",
      },
    },
  },
  plugins: [],
};

export default config;
