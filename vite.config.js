import { parse, resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'src/site/assets',
    emptyOutDir: false,
    sourcemap: mode === 'development',
    cssCodeSplit: true,
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
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            const baseName = parse(assetInfo.name).name;
            return `css/${baseName}[extname]`;
          }
          return '[name][extname]';
        },
      },
    },
  },
}));
