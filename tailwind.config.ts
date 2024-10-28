import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{ts,tsx}', './index.html'],
	theme: {
		extend: {
			colors: {
				primary: '#0095F6',
			},
		},
	},
	important: true,
	plugins: [],
};

export default config;
