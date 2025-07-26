// tailwind.config.cjs
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            500: "#3b82f6",  // Blue
            600: "#2563eb",
          },
          secondary: {
            500: "#10b981",  // Emerald
            600: "#059669",
          },
          accent: {
            500: "#8b5cf6",  // Violet
            600: "#7c3aed",
          },
        },
        boxShadow: {
          card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }
      },
    },
  };