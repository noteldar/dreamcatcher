import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            // Example of adding custom animation for glow effect if needed
            animation: {
                'border-glow': 'border-glow 1.5s ease-in-out infinite alternate',
            },
            keyframes: {
                'border-glow': {
                    '0%': { boxShadow: '0 0 5px #A855F7, 0 0 10px #A855F7' }, // purple-500
                    '100%': { boxShadow: '0 0 20px #C026D3, 0 0 30px #C026D3' }, // fuchsia-600
                },
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
}

const fullConfig = {
    ...config,
    safelist: [
        {
            pattern: /bg-(slate|emerald|sky|rose|violet|amber|teal|pink|indigo)-(100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'focus'],
        },
        {
            pattern: /border-(slate|emerald|sky|rose|violet|amber|teal|pink|indigo)-(100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'focus'],
        },
        {
            pattern: /text-(slate|emerald|sky|rose|violet|amber|teal|pink|indigo)-(100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'focus'],
        },
        {
            pattern: /shadow-(slate|emerald|sky|rose|violet|amber|teal|pink|indigo)-(100|200|300|400|500|600|700|800|900)(\/\d+)?/,
            variants: ['hover', 'focus'],
        },
        {
            pattern: /bg-opacity-(5|10|15|20|25|30|40|50|60|70|75|80|90|95|100)/,
        },
        // For shadows like shadow-md, shadow-lg, shadow-xl
        'shadow-md',
        'shadow-lg',
        'shadow-xl',
    ],
    // Safelist classes if they are dynamically generated and not picked up by Tailwind
    // safelist: [
    //   // Example: /^bg-(red|green|blue)-(100|200|300)$/,
    // ],
}

export default fullConfig 
