import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages project site: https://<user>.github.io/gabBirthday/
export default defineConfig(({ mode }) => ({
	base: mode === 'production' ? '/gabBirthday/' : '/',
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
	],
	// Uppercase image extensions are treated as static assets (fixes import-analysis errors).
	assetsInclude: [
		'**/*.JPG',
		'**/*.JPEG',
		'**/*.PNG',
		'**/*.GIF',
		'**/*.WEBP',
	],
}))
