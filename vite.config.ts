import devtoolsJson from 'vite-plugin-devtools-json';
import { visualizer } from 'rollup-plugin-visualizer';

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';
import fs from 'fs';

export default defineConfig({
	plugins: [
		sveltekit(),
		devtoolsJson(),
		visualizer({
			emitFile: true,
			filename: '.reports/build/vite-rollup-stats.html'
		}) as PluginOption
	],
	server: {
		https: {
			key: fs.readFileSync(`${__dirname}/cert/key.pem`),
			cert: fs.readFileSync(`${__dirname}/cert/cert.pem`)
		},
		proxy: {}
	}
});
