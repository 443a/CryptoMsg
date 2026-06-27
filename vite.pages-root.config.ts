/**
 * @fileoverview Static bundle for GitHub Pages branch/root fallback.
 * @version 5.0.0
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@services': resolve(__dirname, 'src/services'),
      '@workers': resolve(__dirname, 'src/workers'),
      '@types': resolve(__dirname, 'src/types'),
      '@i18n': resolve(__dirname, 'src/i18n'),
    },
  },

  build: {
    outDir: 'assets/app',
    emptyOutDir: false,
    sourcemap: false,
    target: 'es2020',
    rollupOptions: {
      input: resolve(__dirname, 'src/main.ts'),
      output: {
        entryFileNames: 'pages-main.js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
    },
  },

  worker: {
    format: 'es',
  },
});
