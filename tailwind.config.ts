import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                number: {
                    1: '#ef4444', // red-500
                    2: '#fbbf24', // amber-400
                    3: '#fde047', // yellow-300
                    4: '#4ade80', // green-400
                    5: '#38bdf8', // sky-400
                    6: '#a855f7', // purple-500
                    7: {
                        red: '#ef4444',    // red-500
                        orange: '#fb923c', // orange-400
                        yellow: '#fde047', // yellow-300
                        green: '#4ade80',  // green-400
                        sky: '#38bdf8',    // sky-400
                        indigo: '#6366f1', // indigo-500
                        violet: '#8b5cf6', // violet-500
                    },
                    8: '#d946ef', // fuchsia-500
                    9: '#9ca3af', // neutral-400
                    10: '#ef4444', // red-500
                },
            },
        },
    },
    safelist: [
        'w-full',
        'h-full',
        'rounded-md',
        'transition-colors',
        'border-2',
        'border',
        'border-dashed',
        'border-gray-300',
        'shadow-sm',
        {
            pattern: /(bg|border)-number-(1|2|3|4|5|6|8|9|10)/,
        },
        {
            pattern: /(bg|border)-number-7-(red|orange|yellow|green|sky|indigo|violet)/,
        },
    ],
    plugins: [],
};

export default config;