/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'restro-green-light': "#ECF1EB",
        'restro-green': "#70B56A",
        'restro-green-dark': "#243922",
        'restro-border-green-light': "#DCE7DB",
        'restro-superadmin-widget-bg': "#BEDC74",
        'restro-superadmin-text-green': "#387F39",
        'restro-superadmin-text-black': "#444444",
        'theme-orange': '#F5A623',
        'theme-dark': '#1e1e1e',
        'theme-light': '#fdfdfd',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#F5A623",
          "primary-content": "#ffffff",
          "secondary": "#1e1e1e",
          "accent": "#F5A623",
          "neutral": "#1e1e1e",
          "base-100": "#ffffff",
          "base-200": "#fdfdfd",
          "base-300": "#f4f4f4",
        },
      },
    ],
  }
}

