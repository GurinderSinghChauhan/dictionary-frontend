// tailwind.config.js
export default {
    darkMode: 'class', // important
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          lavender: {
            400: '#000',
            600: '#000',
            700: '#000',
          },
          tomato: {
            400: '#ff6347',
            500: '#e5533a',
          },
          primaryText: "#1a1a1a",
          secondaryText: "#555555",
          accent: "#3B82F6",
          linkHover: "#2563EB",
        },
      },
    },
    plugins: [],
  }