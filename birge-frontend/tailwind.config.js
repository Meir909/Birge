/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#4F46E5",
                secondary: "#10B981",
                accent: "#F59E0B",
                dark: "#1F2937",
                "light-gray": "#F3F4F6",
                error: "#EF4444",
                warning: "#F59E0B",
            },
            fontFamily: {
                inter: ["Inter", "sans-serif"],
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            borderRadius: {
                'button': '8px',
                'card': '12px',
            }
        },
    },
    plugins: [],
};
