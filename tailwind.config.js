/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Garbage collection colors
        'papel': '#1e40af', // Blue for papel/cartão
        'embalagens': '#eab308', // Yellow for embalagens
        'bioresiduos': '#92400e', // Brown for bioresiduos
        'indiferenciados': '#059669', // Green for indiferenciados
      }
    },
  },
  plugins: [],
};

