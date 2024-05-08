import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				mainTheme: {
					primary: '#6097ff',
					secondary: '#e3ecfe',
					accent: '#00ffff',
					neutral: '#ff00ff',
					'base-100': '#ffffff',
					info: '#0000ff',
					success: '#00ff00',
					warning: '#fdfd96',
					error: '#ff0000',
				},
			},
			// 'cupcake',
			'mainTheme',
		], // business add here
	},
};
export default config;
