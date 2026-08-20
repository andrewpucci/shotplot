import { parse, resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: '/assets/',
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import', 'if-function'],
      },
    },
  },
  build: {
    outDir: 'dist/assets',
    emptyOutDir: false,
    sourcemap: mode === 'development',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        scripts: resolve(__dirname, 'src/js/main.js'),
        main: resolve(__dirname, 'src/scss/main.scss'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'scripts') return 'js/scripts.js';
          return 'js/[name].js';
        },
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] || '';
          if (fileName.endsWith('.css')) {
            const baseName = parse(fileName).name;
            return `css/${baseName}[extname]`;
          }
          if (/\.(woff2?|ttf|eot)$/.test(fileName)) {
            return 'fonts/[name][extname]';
          }
          return '[name][extname]';
        },
      },
    },
  },
}));
