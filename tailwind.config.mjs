/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      colors: {
        'bg-primary': '#0c0f0a',
        'bg-secondary': '#131810',
        'bg-tertiary': '#1a1f16',
        'accent': '#c1d63e',
        'accent-secondary': '#a3b835',
      }
    },
	},
	plugins: [],
}
