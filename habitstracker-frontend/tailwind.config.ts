import { plugin } from 'mongoose';
import type { Config } from 'tailwindcss';

export default {
    content: [
        ".pages/**/*.{js,jsx,ts,tsx}",
        ".components/**/*.{js,jsx,ts,tsx}",
        ".app/**/*.{js,jsx,ts,tsx}",

    ],
    theme: {
        extend: {
            colors: {
                background: "varr(background-color)", 
                foreground: "varr(foreground-color)", 
            },
        }, 
    },
    plugins: [],
} satisfies Config;