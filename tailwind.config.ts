import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#0f172a',
                    accent: '#e11d48',
                },
            },
            container: {
                center: true,
                padding: '1rem',
                screens: {
                    '2xl': '1200px',
                },
            },
        },
    },
    plugins: [],
};

export default config;

