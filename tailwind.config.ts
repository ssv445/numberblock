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
            animation: {
                'rainbow-glow': 'rainbow-glow 3s linear infinite',
                'rainbow-border': 'rainbow-border 3s linear infinite',
            },
            keyframes: {
                'rainbow-glow': {
                    '0%': { boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)' },
                    '17%': { boxShadow: '0 0 10px rgba(255, 165, 0, 0.5)' },
                    '33%': { boxShadow: '0 0 10px rgba(255, 255, 0, 0.5)' },
                    '50%': { boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)' },
                    '67%': { boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)' },
                    '83%': { boxShadow: '0 0 10px rgba(238, 130, 238, 0.5)' },
                    '100%': { boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)' },
                },
                'rainbow-border': {
                    '0%': { borderColor: '#ff0000' },
                    '17%': { borderColor: '#ffa500' },
                    '33%': { borderColor: '#ffff00' },
                    '50%': { borderColor: '#00ff00' },
                    '67%': { borderColor: '#0000ff' },
                    '83%': { borderColor: '#ee82ee' },
                    '100%': { borderColor: '#ff0000' },
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