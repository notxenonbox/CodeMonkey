const debug = process.env.NODE_ENV != 'production';
require('esbuild').buildSync({
	entryPoints: ['src/main.ts'],
	platform: 'node',
	outdir: 'dist',
	minify: !debug,
	define: { DEBUG: '' + debug, PROJECT_DIR: JSON.stringify(__dirname) },
});
